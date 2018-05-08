//Event Listeners

$('#selclient').change(function(event) {
	subkeywordsarr = [];
	tvarr = [], varr = [], earr = [], pcarr = [];

	salertloading(isTouchDevice());

	cid = $(this).children(':selected').attr('data-clientid');
	cname = event.target.value;
	console.log('Client ID: '+cid);
	console.log('Client Name: '+cname);

	$('#btnnpapper').attr({
		'href': 'http://v22.multclipp.com.br/banca/?path='+cid,
		'target': '_blank'
	});

	load_data('startpage', cid, todaydate, todaydate);
});

$('#bannerheader').on('load', function() {
	// console.log('Image loaded in DOM!');
	// bannerurl = $(this).attr('src');
	setcolors();
});

cdatebtn.click(function(event) {
	salertloading(isTouchDevice());
	cdatebtn.ladda('start');

	if (clientselid == 0) {
		cliid = cid;
	} else {
		cliid = clientselid;
	}

	fdpstartdate = $('#dpsdate').data('datepicker').getFormattedDate('yyyy-mm-dd');
	fdpenddate = $('#dpedate').data('datepicker').getFormattedDate('yyyy-mm-dd');

	count_vtype(cliid, fdpstartdate, fdpenddate);
	count_rating(cliid, fdpstartdate, fdpenddate);
	count_states(cliid, fdpstartdate, fdpenddate);
	count_client(cliid, fdpstartdate, fdpenddate);
	get_subject_keywords(cliid, fdpstartdate, fdpenddate, true, function(keywid){
		add_keyword_news(keywid, cliid, fdpstartdate, fdpenddate, true, 'selecteddate');
	});

	$('#sublist').slideDown('fast');
});

cadsbtn.click(function(event) {
	cadsbtn.ladda('start');

	$('#sublist').slideUp('fast');

	$('.dataTables_processing').show();

	vstartdate = $('#adsstartdate').val();
	venddate = $('#adsenddate').val();

	if (vstartdate.length == 0) {
		$('#adsstartdate.tooltipinput').tooltip('show');
		cadsbtn.ladda('stop');
		return;
	} else {
		$('#adsstartdate.tooltipinput').tooltip('hide');
	}

	if (venddate.length == 0) {
		$('#adsenddate.tooltipinput').tooltip('show');
		cadsbtn.ladda('stop');
		return;
	} else {
		$('#adsenddate.tooltipinput').tooltip('hide');
	}

	adsstartdate = $('#adsstartdate').data('datepicker').getFormattedDate('yyyy-mm-dd');
	adsenddate = $('#adsenddate').data('datepicker').getFormattedDate('yyyy-mm-dd');
	adsstarttime = $('#adsstarttime').val();
	adsendtime = $('#adsendtime').val();

	$('#dpsdate').datepicker('update', new Date(adsstartdate+'T00:00:00'));
	$('#dpedate').datepicker('update', new Date(adsenddate+'T00:00:00'));

	adsveiculoarr = adsveiculoarr.concat(adsveiculossitesarr);

	adstext = $('#adstext').val();

	var adssearchdata = {
		'idempresa': cliid,
		'startdate': adsstartdate,
		'enddate': adsenddate,
		'starttime': adsstarttime,
		'endtime': adsendtime,
		'subjectsid': adssubjectarr,
		'keywordsid': adskeywordarr,
		'tveiculosid': adstveiculoarr,
		'veiculosid': adsveiculoarr,
		'editoriasid': adseditoriaarr,
		'estadosid': adsstatesarr,
		'texto': adstext,
		'destaque': adsdestaque,
		'motivacao': adsmotivacaoarr,
		'avaliacao': adsavaliacaoarr
	};

	// console.log(adssearchdata);

	postData('/home/advsearch', adssearchdata)
	.then(
		data => {
			console.log(data);

			add_advsearch_news_data(data, cliid);

			// cadsbtn.ladda('stop');
			// $('#advancedsearch').modal('hide');
			// $('input').iCheck('uncheck');
		}
	).catch(
		error => {
			console.error(error);

			cadsbtn.ladda('stop');
		}
	);
});

$('input').on('itemAdded', function(event) {
	vsiteid = event.item.Id;
	vsitenm = event.item.Nome;

	adsveiculossitesarr.push(vsiteid);

	$('#adseditoria').selectpicker({title: 'Aguarde...'});
	$('#adseditoria').selectpicker('refresh');
	get_editoriasfromveiculos(vsiteid, function(data) {
		data.map(function(val, index) {
			html =	'<option data-type="adseditoria" data-veiculoid="'+vsiteid+'" data-editoriaid="'+val.Id+'" '+
							'data-subtext="('+vsitenm+')" val="'+val.Id+'">'+val.Nome+'</option>';
			$('#adseditoria').append(html);
		})

		$('#adseditoria').removeAttr('disabled');
		$('#adseditoria').removeClass('disabled');
		$('#adseditoria').selectpicker({title: 'Nada selecionado'});
		$('#adseditoria').selectpicker('refresh');
	});
});

$('input').on('itemRemoved', function(event) {
	vsiteid = event.item.Id;
	vsitenm = event.item.Nome;

	vindex = adsveiculossitesarr.indexOf(vsiteid);
	adsveiculossitesarr.splice(vindex, 1);

	$('#adseditoria').find('[data-veiculoid='+vsiteid+']').remove();
	$('#adseditoria').selectpicker('refresh');
});

$('input').on('ifChecked', function(event) {
	dtype = $(this).attr('data-type');
	dval = $(this).attr('data-val');

	switch (dtype) {
		case 'adsdestaque':
			adsdestaque = dval;
			break;
		case 'adsmotivacao':
			adsmotivacaoarr.push(dval);
			break;
		case 'adsavaliacao':
			adsavaliacaoarr.push(dval);
			break;
		default:
			console.log('option not recognized!');
			break;
	}
	// console.log('destaque:');
	// console.log(adsdestaque);

	// console.log('motivacao:');
	// console.log(adsmotivacaoarr);

	// console.log('avaliacao:');
	// console.log(adsavaliacaoarr);
});

$('input').on('ifUnchecked', function(event) {
	dtype = $(this).attr('data-type');
	dval = $(this).attr('data-val');

	switch (dtype) {
		case 'adsdestaque':
			//do nothing;
			break;
		case 'adsmotivacao':
			aindex = adsmotivacaoarr.indexOf(dval);
			adsmotivacaoarr.splice(aindex, 1);
			break;
		case 'adsavaliacao':
			aindex = adsavaliacaoarr.indexOf(dval);
			adsavaliacaoarr.splice(aindex, 1);
			break;
		default:
			console.log('option not recognized!');
			break;
	}
});

$('.modal').on('show.bs.modal', function(event) {
	$('html').css('overflow-y', 'hidden');
});

$('.modal').on('hide.bs.modal', function(event) {
	$('html').css('overflow-y', 'auto');
});

$('#advancedsearch').on('shown.bs.modal', function(event){
	var adssubjectarr = [], adskeywordarr = [],
	adstveiculoarr = [], adsveiculoarr = [],
	adseditoriaarr = [], adsstatesarr = [],
	adsveiculossitesarr = [];
});

$('#advancedsearch').on('hidden.bs.modal', function(event){
	$('#adssubject').selectpicker('deselectAll');

	$('#adskeyword').selectpicker('deselectAll');
	$('#adskeyword').children('option').remove();
	$('#adskeyword').selectpicker('refresh');

	$('#adstveiculo').selectpicker('deselectAll');

	$('#adsveiculosites').slideUp('fast');
	$('#adsveiculosites').tagsinput('removeAll');

	$('#adsveiculo').selectpicker('deselectAll');
	$('#adsveiculo').children('option').remove();
	$('#adsveiculo').selectpicker('refresh');

	$('#adseditoria').selectpicker('deselectAll');
	$('#adseditoria').children('option').remove();
	$('#adseditoria').selectpicker('refresh');

	$('#adsstartdate').val(null);
	$('#adsenddate').val(null);

	$('#adsstarttime').val('00:00');
	$('#adsendtime').val('23:59');

	$('#adsstates').selectpicker('deselectAll');
	$('#adsstates').children('option').remove();
	$('#adsstates').selectpicker('refresh');

	$('#adstext').val(null);
	$('.i-checks').iCheck('uncheck');
});

$('#showsinglenews').on('hide.bs.modal', function(event) {
	$('#mediactni').css('display', 'none');
	$('#modalcsinglenewsi').css('display', 'none');
	$('#modalcsinglenewsv').css('display', 'none');
	$('#modaltitlerow').css('display', 'none');
	$('#btnsgroupsnews').css('display', 'none');
	if (isTouchDevice() == false) {
		$('#showsinglenews > .modal-dialog.modal-lg').css('width', '900px');
	}

	$('#mediactni').css('overflow-y', 'hidden');
	$('#modal-texti').slimScroll({
		height: '250px',
		railVisible: true,
		touchScrollStep: 800
	});


	if ($('#btnurl').hasClass('disabled') == false) {
		$('#btnurl').addClass('disabled');
		$('#btnurl').attr('disabled', true);
	}

	$('#mediaimgload').css('display', 'block');
	$('#modalwsinglenews').css('display', 'block');

	if (mediatype == 'video' || mediatype == 'audio') {
		var mmediadel = $('#mediaelvideo');
		if (mmediadel[0].paused) {
			// mmediadel[0].play();
		} else {
			mmediadel[0].pause();
		}
	}
});

$('#tablenews').on(
	'click',
	'tbody > tr > td:nth-child(2),'+
	'tbody > tr > td:nth-child(3),'+
	'tbody > tr > td:nth-child(4),'+
	'tbody > tr > td:nth-child(5),'+
	'tbody > tr > td:nth-child(8)',
	function (event) {
		// var trc = tablenews.row(this).node();
		$(this).parent().toggleClass('selected');
		trselclass = $(this).parent().hasClass('selected');
		trselid = $(this).parent().attr('id').replace('tr_','');
		if (trselclass) {
			trselected.push(trselid);
		} else {
			trselidx = trselected.indexOf(trselid);
			trselected.splice(trselidx, 1);
		}
		console.log(trselected);
	}
);

$('#btneexcel').click(function(event) {
	idsnots = [];
	idskws = [];

	if (trselected.length > 0) {
		tbnrows = trselected;
	} else {
		tbnrows = [];
		tbnrowsnodes = tablenews.rows().nodes();
		tbnrowsnodes.map(function(tbnrindex, tbnrelem) {
			tbnrows.push($(tbnrindex).attr('id'));
		});
	}

	tbnrows.map(function(tbnindex, tbnelem) {
		tbnidnot = parseInt(tbnindex.replace('tr_',''));
		idsnots.push(tbnidnot);
		rowindex = tablenews.row('#tr_'+tbnidnot).index();
		cellnode = tablenews.cell(rowindex,4).node();
		ckws = $(cellnode).children('span[data-keywordid]');
		ckws.map(function(ckwindex, ckwelem) {
			attelem = parseInt($(ckwelem).attr('data-keywordid'));
			if (idskws.indexOf(attelem) === -1) {
				idskws.push(parseInt(attelem));
			}
		});
	});

	startdate = $('#dpsdate').data('datepicker').getFormattedDate('yyyy-mm-dd');
	enddate = $('#dpedate').data('datepicker').getFormattedDate('yyyy-mm-dd');

	exportdata = {
		'startdate': startdate,
		'enddate': enddate,
		'idemp': cliid,
		'idsnot': idsnots.sort(),
		'idskw': idskws.sort()
	}

	console.log(exportdata);

	add_data_export(exportdata, function(e){
		tableexport.button(0).trigger();
	});
});

$(document).on('click', '.tooltipa', function(event) {
	var titlec = $(this);
	var titletrid = titlec.parent().parent().attr('id');
	var titlenid = titlec.attr('data-newsid');
	var titlekid = titlec.attr('data-keywordid');
	var titlecid = titlec.attr('data-clientid');

	$('#showsinglenews').modal('show');

	dtworker.postMessage({
		'vfunction':'set_single_news_dtw',
		'method':'GET',
		'url': '/home/single_news/'+titlenid+'/'+titlecid,
		'clientid': titlecid,
		'trid': titletrid,
		'startdate': null,
		'enddate': null,
		'ptype': null
	});
});

$(document).on('click', '.rdaval', function(event){
	dataparid = $(this).parent().attr('id');
	dtnewsid = parseInt($(this).attr('data-newsid'));
	dtselector = '#'+dataparid+' .rdaval';
	$(dtselector).removeClass('active btn-danger btn-warning btn-success');
	$(dtselector).addClass('btn-default');
	$(this).children('i').remove();
	$(this).append('<i class="fa fa-circle-o-notch fa-spin"</i>');

	dataavaliacao = $(this).attr('data-aval');

	switch(dataavaliacao) {
		case '1':
			staval = 1;
			ihtml = '<i class="fa fa-frown-o"></i>';
			removeclass = 'btn-default';
			addclass = 'btn-danger active';
			break;
		case '2':
			staval = 2;
			ihtml = '<i class="fa fa-meh-o"></i>';
			removeclass = 'btn-default';
			addclass = 'btn-warning active';
			break;
		case '3':
			staval = 3;
			ihtml = '<i class="fa fa-smile-o"></i>';
			removeclass = 'btn-default';
			addclass = 'btn-success active';
			break;
		default:
			//do nothing;
			break;
	}

	objsetaval = {
		'aval': staval,
		'idclient': cliid,
		'idnews': dtnewsid
	};

	postData('/home/set_aval', objsetaval)
	.then(
		data => {
			console.log(data);

			$(this).children('i').remove();
			$(this).append(ihtml);
			$(this).removeClass(removeclass);
			$(this).addClass(addclass);
		}
	).catch(
		error => {
			console.error(error);
		}
	);
});

$(document).on('click', '.rdmoti', function(event){
	dataparid = $(this).parent().attr('id');
	dtnewsid = parseInt($(this).attr('data-newsid'));
	dtselector = '#'+dataparid+' .rdmoti';
	$(dtselector).removeClass('active btn-warning btn-success');
	$(dtselector).addClass('btn-default');
	$(this).children('i').remove();
	$(this).append('<i class="fa fa-circle-o-notch fa-spin"</i>');

	datamotivacao = $(this).attr('data-moti');

	switch(datamotivacao) {
		case '1':
			stmoti = 1;
			ihtml = '<i class="fa fa-users"></i>';
			removeclass = 'btn-default';
			addclass = 'btn-success active'
			break;
		case '2':
			stmoti = 2;
			ihtml = '<i class="fa fa-handshake-o">';
			removeclass = 'btn-default';
			addclass = 'btn-warning active';
			break;
		default:
			//do nothing;
			break;
	}

	objsetmoti = {
		'moti': stmoti,
		'idclient': cliid,
		'idnews': dtnewsid
	};

	postData('/home/set_moti', objsetmoti)
	.then(
		data => {
			console.log(data);

			$(this).children('i').remove();
			$(this).append(ihtml);
			$(this).removeClass(removeclass);
			$(this).addClass(addclass);
		}
	).catch(
		error => {
			console.error(error);
		}
	);
});

$('#btnselclo').click(function(event) {
	// $('#modal-texti').scrollTop(0);
	$('#modal-texti').slimScroll({scrollTo: '0px'});
	$('#mediactni').scrollTop(0);

	btnsctrid = $(this).attr('data-trid');

	if ($('#'+btnsctrid).hasClass('selected') == false) {
		$('#'+btnsctrid).addClass('selected');
	}

	$('#showsinglenews').modal('hide');
});

document.getElementById('btnclose').addEventListener('click', function(){
	// document.getElementById('modal-texti').scrollTop = 0;
	$('#modal-texti').slimScroll({ scrollTo: '0px' });
	document.getElementById('mediactni').scrollTop = 0;
});

// $(document).on('click', '.bs-select-all', function(event) {
// 	console.log('Clicked on Select All');
// 	console.log(event);
// });

// $(document).on('click', '.bs-deselect-all', function(event) {
// 	console.log('Clicked on Deselect All');
// 	console.log(event);
// });

$(document).on('changed.bs.select', '#sublist select', function(e, clickedIndex, newValue, oldValue) {
	keywid = $(this).find('option').eq(clickedIndex).attr('data-keywordid');
	fopstartdate = $('#dpsdate').data('datepicker').getFormattedDate('yyyy-mm-dd');
	fopenddate = $('#dpedate').data('datepicker').getFormattedDate('yyyy-mm-dd');

	if (newValue) {
		$('.dataTables_processing').show();
		dtworker.postMessage({
			'vfunction':'add_keyword_news_data',
			'method':'GET',
			'url': '/home/keyword_news/'+keywid+'/'+cliid+'/'+fopstartdate+'/'+fopenddate,
			'clientid': cliid,
			'keywordid': keywid,
			'startdate': fopstartdate,
			'enddate': fopenddate,
			'ptype': 'subjectkeyword'
		});
	} else {
		remove_keyword_news(keywid);
	}
});

$('#adssubject').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue) {
	var subjid = $(this).find('option').eq(clickedIndex).attr('data-subjectid');
	var subsname = $(this).find('option').eq(clickedIndex).text();

	if (newValue) {
		adssubjectarr.push(subjid);

		$('#adskeyword').selectpicker({title: 'Aguarde...'});
		$('#adskeyword').selectpicker('refresh');
		get_keywordsfromsubject(subjid, function(data) {
			data.map(function(val, index) {
				html =	'<option data-type="adskeyword" data-subjectid="'+val.idAssunto+'" data-keywordid="'+val.Id+'" '+
								'data-subtext="('+subsname+')" val="'+val.Id+'">'+val.Nome+'</option>';
				$('#adskeyword').append(html);
			})

			$('#adskeyword').removeAttr('disabled');
			$('#adskeyword').removeClass('disabled');
			$('#adskeyword').selectpicker({title: 'Nada selecionado'});
			$('#adskeyword').selectpicker('refresh');
		});
	} else {
		sindex = adssubjectarr.indexOf(subjid);
		adssubjectarr.splice(sindex, 1);

		$('#adskeyword').find('[data-subjectid='+subjid+']').remove();
		$('#adskeyword').selectpicker('refresh');
	}

	// console.log('Assunto:');
	// console.log(adssubjectarr);
});

$('#adskeyword').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue) {
	var keywid = $(this).find('option').eq(clickedIndex).attr('data-keywordid');
	var keywname = $(this).find('option').eq(clickedIndex).text();

	if (newValue) {
		adskeywordarr.push(keywid);
	} else {
		kindex = adskeywordarr.indexOf(keywid);
		adskeywordarr.splice(kindex, 1);
	}

	// console.log('Palavra-chave:');
	// console.log(adskeywordarr);
});

$('#adstveiculo').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue) {
	var tveid = $(this).find('option').eq(clickedIndex).attr('data-tveiculoid');
	var tvesname = $(this).find('option').eq(clickedIndex).text();

	if (newValue) {
		adstveiculoarr.push(tveid);
		if (tveid == 4) {
			$('#adstveiculo').selectpicker('toggle');
			$('#adsveiculositesfg').slideDown('fast');
		} else {
			adsvslt = $('#adsveiculosites').val();
			if (adsvslt.length > 0) {
			} else {
				$('#adsveiculositesfg').slideUp('fast');
			}

			$('#adsveiculo').selectpicker({title: 'Aguarde...'});
			$('#adsveiculo').selectpicker('refresh');
			get_veiculosfromtipoveiculos(tveid, function(data) {
				data.map(function(val, index) {
					html =	'<option data-type="adsveiculo" data-tveiculoid="'+val.idTipoVeiculo+'" data-veiculoid="'+val.Id+'" '+
									'data-subtext="('+tvesname+')" val="'+val.Id+'">'+val.Nome+'</option>';
					$('#adsveiculo').append(html);
				})

				$('#adsveiculo').removeAttr('disabled');
				$('#adsveiculo').removeClass('disabled');
				$('#adsveiculo').selectpicker({title: 'Nada selecionado'});
				$('#adsveiculo').selectpicker('refresh');
			});
		}
	} else {
		tvindex = adstveiculoarr.indexOf(tveid);
		adstveiculoarr.splice(tvindex, 1);

		$('#adsveiculo').find('[data-tveiculoid='+tveid+']').remove();
		$('#adsveiculo').selectpicker('refresh');
	}

	// console.log('Tipo de Veiculo:');
	// console.log(adstveiculoarr);
});

$('#adsveiculo').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue) {
	var veid = $(this).find('option').eq(clickedIndex).attr('data-veiculoid');
	var vesname = $(this).find('option').eq(clickedIndex).text();

	if (newValue) {
		adsveiculoarr.push(veid);

		$('#adseditoria').selectpicker({title: 'Aguarde...'});
		$('#adseditoria').selectpicker('refresh');
		get_editoriasfromveiculos(veid, function(data) {
			data.map(function(val, index) {
				html =	'<option data-type="adseditoria" data-veiculoid="'+val.idVeiculo+'" data-editoriaid="'+val.Id+'" '+
								'data-subtext="('+vesname+')" val="'+val.Id+'">'+val.Nome+'</option>';
				$('#adseditoria').append(html);
			})

			$('#adseditoria').removeAttr('disabled');
			$('#adseditoria').removeClass('disabled');
			$('#adseditoria').selectpicker({title: 'Nada selecionado'});
			$('#adseditoria').selectpicker('refresh');
		});
	} else {
		vindex = adsveiculoarr.indexOf(veid);
		adsveiculoarr.splice(vindex, 1);

		$('#adseditoria').find('[data-veiculoid='+veid+']').remove();
		$('#adseditoria').selectpicker('refresh');
	}

	// console.log('Veiculo:');
	// console.log(adsveiculoarr);
});

$('#adseditoria').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue) {
	var edid = $(this).find('option').eq(clickedIndex).attr('data-editoriaid');
	var vedsname = $(this).find('option').eq(clickedIndex).text();

	if (newValue) {
		adseditoriaarr.push(edid);
	} else {
		eindex = adseditoriaarr.indexOf(edid);
		adseditoriaarr.splice(eindex, 1);
	}

	// console.log('Editoria:');
	// console.log(adseditoriaarr);
});

$('#adsstates').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue) {
	var stateid = $(this).find('option').eq(clickedIndex).attr('data-stateid');
	var statename = $(this).find('option').eq(clickedIndex).text();

	if (newValue) {
		adsstatesarr.push(stateid);
	} else {
		sindex = adsstatesarr.indexOf(stateid);
		adsstatesarr.splice(sindex, 1);
	}

	// console.log('States:');
	// console.log(adsstatesarr);
});

$('#btnasearch').click(function(event) {
	$('#advancedsearch').modal('show');
});

$('.cdrefreshitem').click(function(event) {
	refreshtm = $(this).attr('data-refreshtm');

	clearInterval(rfdata);
	refresh_countdown(refreshtm);
});

$('#btnexpand').click(function(event) {
	$('#mediactni').animate({'height': '100%'}, 'fast');
	$('#showsinglenews > .modal-dialog.modal-lg').animate({'width': '98%'}, 'fast');
	$('#modal-texti').slimScroll({
		height: 'auto',
	});
});

$('#btndown').click(function(event) {
	downtype = $(this).attr('data-downtype');

	$(this).removeClass('disabled');
	$(this).removeAttr('disabled');

	switch (downtype) {
		case 'video':
			// statements_1
			break;
		case 'audio':
			// statements_1
			break;
		case 'image':
			// statements_1
			break;
		case 'noimage':
			$(this).addClass('disabled');
			$(this).attr('disabled', true);
			break;
		case 'facsimile':
			canvas = document.createElement('canvas');
			ctx = canvas.getContext('2d');

			imgw = imgobj.width;
			imgh = imgobj.height;
			ctx.canvas.width = imgw;
			ctx.canvas.height = imgh;

			ctx.drawImage(imgobj, 0, 0);
			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			ctx.fillRect(0, 0, imgw, imgh);
			ctx.drawImage(imgobj, snewsx1, snewsy1, snewsmw, snewsmh, snewsx1, snewsy1, snewsmw, snewsmh);

			document.getElementById('divmediacanvas').innerHTML = '';
			canvas.setAttribute('id', 'mediacanvas');
			document.getElementById('divmediacanvas').appendChild(canvas);

			canvasel = document.getElementById('mediacanvas');
			canvasdataURL = canvasel.toDataURL('image/png');
			cvdowndataURL = canvasel.toDataURL('image/png').replace('image/png', 'image/octet-stream');
			// canvasdataURL = canvasel.toDataURL('image/png').replace('image/png', 'application/stream');

			// imgwred = (imgw * 25) / 100;
			// imghred = (imgh * 25) / 100;

			windowo = window.open();
			windowo.document.write(
				'<img src="'+canvasdataURL+'" style="width: 30%"/>'+
				'<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>'+
				'<script type="text/javascript" charset="utf-8">'+
				'$("img").click(function(event) {'+
						'if ($(this).hasClass("expanded")) {'+
							'$(this).removeClass("expanded");'+
							'$(this).animate({"width": "30%"}, "fast");'+
						'} else {'+
							'$(this).addClass("expanded");'+
							'$(this).animate({"width": "100%"}, "fast");'+
						'}'+
				'	});'+
				'</script>'
				);
			break;
	}
});

dtworker.onmessage = function(event) {
	jresponse = JSON.parse(event.data.response);
	if (typeof event.data.clientid !== 'undefined') {
		wcliendid = event.data.clientid;
	} else {
		wcliendid = 0;
	}
	if (typeof event.data.trid !== 'undefined') {
		wtrid = event.data.trid;
	} else {
		wtrid = null;
	}
	wstartdate = event.data.startdate;
	wenddate = event.data.enddate;
	wptype = event.data.ptype;
	if (typeof event.data.keywordid !== 'undefined') {
		wkeywordid = event.data.keywordid;
	} else {
		wkeywordid = 0;
	}

	vfunc = event.data.vfunction;
	switch (vfunc) {
		case 'get_client_info':
			set_client_info(wcliendid, jresponse.name, jresponse.banner, true);
			break;
		case 'count_vtype':
			set_count_vtype(jresponse);
			break;
		case 'count_states':
			set_count_states(jresponse);
			break;
		case 'count_rating':
			set_count_rating(jresponse);
			break;
		case 'count_client':
			set_count_client(jresponse);
			break;
		case 'get_subject_keywords':
			$('#dpsdate').datepicker('update', new Date(wstartdate+'T00:00:00'));
			$('#dpedate').datepicker('update', new Date(wenddate+'T00:00:00'));
			add_keyword_news(set_subject_keywords(jresponse, true), wcliendid, wstartdate, wenddate, true, wptype);
			break;
		case 'get_subjects':
			set_subjects(jresponse);
			break;
		case 'add_keyword_news_data':
			add_keyword_news_data(jresponse, wkeywordid, wcliendid, false, wptype);
			break;
		case 'set_single_news_dtw':
			set_single_news_dtw(jresponse, wtrid);
			break;
		default:
			console.log('Function not recog!');
			break;
	}
}