History.Adapter.bind(window, 'statechange', function() {
  routingUpdate();

});


//**********************************************************TOP NOTIFICATIONS


function system_notification(data){
	$('.notification-bar').html(data);
	$('.notification-bar').slideDown(200).delay(6500).slideUp(200);
}
//**************************************************************LIBRAR
//**************************************************************LIBRARY

	var DateFormats = {
       short: "DD MMM YYYY",
       long: "dddd DD.MM.YYYY HH:mm"	
	};

	var created_venture=false;

	function menuHandler(e){
		$(this).parent().parent().parent().removeClass('hover');
		$(this).parent().parent().parent().parent().removeClass('expanded');
		console.log($(this).html());
   		if($(this).html()=='My Ventures'){
    		e.preventDefault();
    		History.pushState(null, "My Ventures", "myventures");
   		}
   		else if($(this).html().substring(0,5)=='Inbox'){
   			e.preventDefault();
    		History.pushState(null, "My Inbox", "inbox");
   		}
   		else if($(this).html()=='Ventures'){
   			e.preventDefault();
    		History.pushState(null, "Ventures", "ventures");
   		}
   		else if($(this).html()=='Expertise' || $(this).html()=='People'){
   			e.preventDefault();
    		History.pushState(null, "Expertise", "expertise");
   		}

   		else if($(this).html()=='My Expertise'){
   			e.preventDefault();
    		History.pushState(null,"My Expertise", "myexpertise");
   		}
   		else if($(this).html()=='About'){
			e.preventDefault();
    		History.pushState(null,"About", "about");   			
   		}
   		else if($(this).html().trim().toLowerCase()=='sign out'){
   			window.location.href="signout";
   		}
   		else{
   				
   		}
    }

    function ajaxCallHandler(url,type,data,successfunction){
    	$.ajax({
				url: url,
				type: type,
				data: data,
				success: function(result, textStatus) {
					data=result;

					if(data.response=='fail'){
			        	 window.location.href = data.redirect;
					}	
					successfunction(result,textStatus);
				},
				fail:function(){
				}			
			 	
			 });
    }

	function routingFunction(){
		var currentURL=window.location.href;
		var routingArray=currentURL.split('/');
		var routingString=routingArray[routingArray.length-1];
		while(routingString[routingString.length-1]=='#')
			routingString=routingString.substring(0,routingString.length,-1)
		return routingString;
	}

	function checkForSideBar(url){
        //green sidebar
        $('.venturelink').removeClass('green-sidebar');		
    	$('.expertiselink').removeClass('green-sidebar');
    	$('.aboutlink').removeClass('green-sidebar');
    	$('.myexpertiselink').removeClass('green-sidebar');
    	$('.myventurelink').removeClass('green-sidebar');
    	$('.expertiselink').removeClass('green-sidebar');
    	$('.messageinboxlink').removeClass('green-sidebar');
    	
    	
    	//grey sidebar
		$('.venturelink').addClass('grey-sidebar');
		$('.expertiselink').addClass('grey-sidebar');
		$('.aboutlink').addClass('grey-sidebar');
    	$('.myexpertiselink').addClass('grey-sidebar');
    	$('.myventurelink').addClass('grey-sidebar');
    	$('.expertiselink').addClass('grey-sidebar');
    	$('.messageinboxlink').addClass('grey-sidebar');

    	switch(currentURL){
    		case 'ventures':
    			$('.venturelink').removeClass('grey-sidebar');
	        	$('.venturelink').addClass('green-sidebar');
	        	break;
	        case 'expertise':
    			$('.expertiselink').removeClass('grey-sidebar');
	        	$('.expertiselink').addClass('green-sidebar');
	        	break;
	        case 'about':
				$('.aboutlink').addClass('green-sidebar');
		        $('.aboutlink').removeClass('grey-sidebar');
		        break;
		    case 'myexpertise':
				$('.myexpertiselink').addClass('green-sidebar');
		        $('.myexpertiselink').removeClass('grey-sidebar');
		        break;
		    case 'inbox':
				$('.messageinboxlink').addClass('green-sidebar');
		        $('.messageinboxlink').removeClass('grey-sidebar');
		        break;
		    case 'myventures':
				$('.myventurelink').addClass('green-sidebar');
		        $('.myventurelink').removeClass('grey-sidebar');
		        break;

    	}
	}

	function routingUpdate(){
		
		currentURL=routingFunction();
		ga('send', 'pageview', { page: currentURL});
		if(currentURL=='ventures'){
			var success=function(result, textStatus) {
					data=JSON.parse(result);
					ventures=data;
					var Source = $("#venture-Template").html();
					Handlebars.registerPartial("position", $("#position-partial").html());
			        var Template = Handlebars.compile(Source);
			        var HTML = Template({ ventures : ventures });
			        $('#content').html(HTML);

					$('.venturebox').height($('.venturebox').width());
				};
			ajaxCallHandler('ajax/get-ventures',"GET",{},success);
			}
		else if(currentURL=='expertise'){
			var success= function(result, textStatus) {
					data=JSON.parse(result);
					var Source = $("#expertise-template").html(); 	 
			        var Template = Handlebars.compile(Source);
			        var HTML = Template({ expertise : data });
			        $('#content').html(HTML);
			        
			        $('.venturebox').height($('.venturebox').width());
				};
			ajaxCallHandler('ajax/get-expertise',"GET",{},success);

		}
		else if(currentURL=='myventures'){
			var success= function(result, textStatus) {
				ventures=JSON.parse(result);
				var Source = $("#venture-Template").html();
				Handlebars.registerPartial("position", $("#position-partial").html());
		        var Template = Handlebars.compile(Source);
		        var HTML = Template({ ventures : ventures });
		        $('#content').html(HTML);
	        	$('.venturebox').height($('.venturebox').width());
			};
			ajaxCallHandler('ajax/get-my-ventures',"GET",{},success);
		}
		else if(currentURL=='inbox'){
				var success= function(result, textStatus) {
					data=JSON.parse(result);;
					var Source = $("#inbox-template").html();
			        var Template = Handlebars.compile(Source);
			        Handlebars.registerHelper("formatDate", function(datetime, format) {
					  if (moment) {
					    var f = DateFormats[format];
					    return moment(datetime).format(f);
					  }
					  else {
					    return datetime;
					  }
					});
			        var HTML = Template({ thread : data });
			        $('#content').html(HTML);
				};
			ajaxCallHandler('ajax/get-inbox',"GET",{},success);
		}
		else if(currentURL=='myexpertise'){

				$.ajax({
						url: "ajax/get-my-expertise",
			  			type: "GET",
			  			
		  			})
				 .success(function(msg){
				  			var tags="";
				  			var data=JSON.parse(msg);	
							if(data.response=='fail'){
					        	 window.location.href = data.redirect;
							}	

							var Source = $("#my-expertise-template").html();
					        var Template = Handlebars.compile(Source);
					        var HTML = Template({user_name:data.user_name,user_id:data.user_id});
					        $('#content').html(HTML);
					        if(data.experience_id==null){
								$('.notenteredtext').show();
							}
					        var success=function success(data){
					        	for(var i=0;i<data.tags.length;i++){
				  					$('.venturebox input[name=taginput]').tagit('createTag', data.tags[i]['tag_name']);
				  				}
				  				$('.venturebox').height($('.venturebox').width());
					        }

				  			tagit('.taginput',success,data);
				  			
				  			$('.venturebox textarea[name=description]').val(data.description);
				  			//$('.venturebox textarea[name=taginput]').val(tags);
		  			})
				 	.fail(function(msg){
				 			$('.notenteredtext').show();
				 	});
			
		}
		else if(currentURL=='signupsuccesss'){
			var Source = $("#signupsuccesss-template").html();
	        var Template = Handlebars.compile(Source);
	        var HTML = Template({});
	        $('#content').html(HTML);

		}
		else if(currentURL=='about'){
			var Source = $("#aboutus-template").html();
	        var Template = Handlebars.compile(Source);
	        var HTML = Template({});
	        $('#content').html(HTML);
	        $(document).foundation('accordion', 'reflow');

		}
		else if(currentURL=='confirmed'){
			var Source = $("#confirmuser-template").html();
	        var Template = Handlebars.compile(Source);
	        var HTML = Template({});
	        $('#content').html(HTML);
		}
		else if(currentURL.substring(0,6)=="thread"){

			var urlSplit=currentURL.split('-');
			if(urlSplit.count!=1){
				var success= function(result, textStatus) {
					var data=JSON.parse(result);
					var Source = $("#thread-template").html();
			        var Template = Handlebars.compile(Source);
					Handlebars.registerHelper("formatDate", function(datetime, format) {
					  if (moment) {
					    var f = DateFormats[format];
					    return moment(datetime).format(f);
					  }
					  else {
					    return datetime;
					  }
					});
			        var HTML = Template(data);
			        $('#content').html(HTML);
			        checkForNotifications();
				};
				ajaxCallHandler('ajax/get-message-thread',"GET",{message_id:urlSplit[1]},success);
			}
		}
		checkForNotifications();
		checkForSideBar(currentURL);
		window.scrollTo(0, 0);

	}

//**************************************************************TOP BAR
//**************************************************************TOP BAR
//**************************************************************TOP BAR
//**************************************************************TOP BAR
//**************************************************************TOP BAR
//**************************************************************TOP BAR

    $(document).foundation('topbar',{ sticky_class : 'sticky', is_hover: true});
    $('.top-bar ul li a').click(menuHandler);
    $('.left-menu a').click(menuHandler);
    $('.not-click').click(function(e){
    	e.preventDefault();
    
	});

//*************************************************************NOTIFICATIONS

	function checkForNotifications(){
		$.ajax({
				url: 'ajax/get-notifications',
				type: 'get',
				data: {},
				success: function(result, textStatus) {
					data=result;

					if(data.response=='fail'){
			        	 window.location.href = data.redirect;
					}	
					if(data!=0){
						$('.notification-menu-item').html('<div href="#" class="notification"><span>'+data+'</span></div>')
					}
					else
						$('.notification-menu-item').html('');
					$('.notification').parent().parent().parent().removeClass('expanded');

				},
				fail:function(){
					
				}			
			 	
		 });
	}

	$('body').on('click','.notification',function(e){
		e.preventDefault();

		History.pushState(null, "My Inbox", "inbox");
	});



//**************************************************************INBOX
//**************************************************************INBOX
//**************************************************************INBOX
//**************************************************************INBOX
//**************************************************************INBOX
$('#content').on('click','.messagethread',function(e){
	e.preventDefault();
	var message_id=$(this).attr('data-message-id');
	History.pushState(null, "Thread", "thread-"+message_id);
	routingUpdate();

});
//messagethread

//**************************************************************MESSAGE THREAD
$('#content').on('click','.replybutton',function(e){
	e.preventDefault();
	 $.ajax({
			url: 'ajax/post-reply',
			type: "POST",
			data: { 
				'receiver_id':$(this).parent().attr('data-receiver-id'),
				'message_type':$(this).parent().attr('data-message-type'),
				'message':$(this).parent().find('textarea[name=replytext]').val(),
				'table_id':$(this).parent().attr('data-table-id'),
				'reference_message_id':$(this).parent().attr('data-reference-id')
			},
			success: function(result, textStatus) {

				routingUpdate();
			}	
	});
});


//**************************************************************EXPERTISE

function tagit(div,successfunction,data){
	$.ajax({
	 		url:'ajax/get-tags',
	 		type:"GET"
	 		}).done(function(msg){
				$(div).tagit({
					"preprocessTag":function(val) {
			  			if (!val) { return ''; }
			  			if(val.charAt(0)=='#')
			  				return val;
			  			return '#'+val;

					},
					"availableTags":JSON.parse(msg),
					placeholderText: 'enter tags',
					maxTags:10
				});
				console.log(data);
				if(data!=null)
					successfunction(data);
		});
}


//**************************************************************EXPERTISE
//**************************************************************EXPERTISE
//**************************************************************EXPERTISE
//**************************************************************EXPERTISE
//**************************************************************EXPERTISE


 $('#content').on('click','.expert-message-btn',function(){
 		var user_id=$(this).parent().parent().attr('data-user-id');
 		 $.ajax({
			url: 'ajax/get-user-data',
			type: "GET",
			data: { 
				user_id:user_id
			},
			success: function(result, textStatus) {
				data=JSON.parse(result);
				position=data;
				var Source = $("#send-expertise-message-template").html();
		        var Template = Handlebars.compile(Source);
		        var HTML = Template(position);
		        $('#dialog').html(HTML);
		        $('#dialog').addClass('tiny');
		        $('#dialog').foundation('reveal','open');

			}	
		 });
 });

 $('#dialog').on('click','.submit-expertise-message',function(){
 	 	var subject=$(this).parent().parent().find('input[name=subject]').val();
 	 	var message=$(this).parent().parent().find('textarea[name=message]').val();

 	 if(subject==''){
 		alert("The subject cannot be blank");
 	}
 	else if(message==''){
 		alert("The message cannot be blank");
 	}
 	else{
 		if(!$(this).hasClass('light-green-button-used')){
	 		var user_id=$(this).parent().parent().attr('data-user-id');
	 		 $.ajax({
				url: 'ajax/post-experience-message',
				type: "POST",
				data: { 
					subject:subject,
					message : message,
					user_id:user_id
				},
				success: function(result, textStatus) {
			        $('#dialog').foundation('reveal','close');
			        system_notification("Your message was successfully sent. You can check it in <a href='inbox'>Inbox</a>");
				}	
			 });
			 $(this).addClass('light-green-button-used');
 		}
 		else{
	 		
 		}
 	}
 });

$('#content').on('click','.expertise-button-submit', function(e){
  	e.preventDefault();
 		if(!$(this).hasClass('rotating-circle-used')){
			var description=$('.venturebox textarea[name=description]').val();
  			var tags=$('.venturebox input[name=taginput]').val();
  			if(description==''){
  				alert("You must fill up a description");
  			}
  			else if(tags==''){
  				alert("You must have at least one tag");
  			}
  			else{
		  		$.ajax({
					url: 'ajax/add-experience',
		  			type: "POST",
		  			data: { user_id : $(this).parent().parent().attr('user-id'),user_description:description,experience_tags:tags}
		  		}).done(function(msg){
		  			History.pushState("", "My Expertise", "expertise");
		  			system_notification("Awesome! You updated your expertise");
		  		});
		  		$(this).addClass('rotating-circle-used')
		  	}
	  	}
	  	else{
	  		
	  	}
  	});

//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES




//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES
//**************************************************************VENTURES


$(document).ready(function(){
 $('#content').on('click','.position-link',function(e){
 		e.preventDefault();
 		$(".position[data-position-id="+$(this).attr('data-position-id')+"]").delay(200).show(0);
 		$(this).parent().parent().parent().toggleClass('flip');
 		$(this).parent().parent().delay(200).hide(0);
 		
 		
 });


$('#content').on('click','.position-message-btn',function(e){
 		var position_id=$(this).parent().attr('data-position-id');
 		 $.ajax({
			url: 'ajax/get-position-data',
			type: "GET",
			data: { 
				position_id:position_id
			},
			success: function(result, textStatus) {
				var data=JSON.parse(result);
				var position=data;
				var Source = $("#send-message-template").html();
		        var Template = Handlebars.compile(Source);
		        var HTML = Template(position);
		        $('#dialog').html(HTML);
		        $('#dialog').foundation('reveal','open');
		        $('#dialog').addClass('tiny');
			}	
		 });
 });



 $('#content').on('click','.position-back-btn',function(e){
 		e.preventDefault();
 		$(this).parent().parent().hide();
 		$(this).parent().parent().parent().toggleClass('flip');
 		$(this).parent().parent().parent().find('.venturedetails').delay(200).show(0);
 });

$('#content').on('click','.create-venture-button',function(){
	if(!created_venture){
		position=data;
		var Source = $("#create-venture-template").html();
        var Template = Handlebars.compile(Source);
        created_venture=true;
        var HTML = Template(position);
        $('#content').find('div').eq(2).prepend(HTML);
        $('.create-venture-button').html('Cancel');
		tagit('.taginput',null);

        //$('#dialog').html(HTML);
        //$('#dialog').addClass("small");
        //$('#dialog').foundation('reveal','open');        
        
		
	}
	else{
		$('#content').find('div').eq(2).html('');
		created_venture=false;
		$('.create-venture-button').html('Create Venture');
	}
});


$('#dialog').on('click','.close-reveal-modal',function(){	
	$('#dialog').foundation('reveal','close');
});

 $('#dialog').on('click','.submit-message',function(){
 	if($(this).parent().parent().find('textarea[name=message]').val()!=''){
	 	if(!$(this).hasClass('light-green-button-used')){
	 		var position_id=$(this).parent().parent().attr('data-position-id');
	 		 $.ajax({
				url: 'ajax/post-position-message',
				type: "POST",
				data: { 
					position_id:$(this).parent().parent().find('input[name=position-id]').val(),
					message : $(this).parent().parent().find('textarea[name=message]').val(),
					receiver_id:$(this).parent().parent().find('input[name=receiver-id]').val()
				},
				success: function(result, textStatus) {
			        $('#dialog').foundation('reveal','close');
			        system_notification("Your message was successfully sent. You can check it in <a href='inbox'>Inbox</a>");
				}	
			});
			 $(this).addClass('light-green-button-used');
	 	}
	}
	else{
		alert("The message cannot be blank");
	}
 });




/**ADDING/EDITING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/
/**ADDING A VENTURE******************************************************************************/



	var positions=[];
	var venturestate=true;
	var currentPositionBeingEdited=-1;

	function addPositionsAgain(){
	    $('.positionlist').html('');
	    for(var i = 0; i < positions.length; i++) {
	    	var tagarray=positions[i].tags.split(',');
			var taglist='';
			for (index = 0; index < tagarray.length; ++index) {
 			   taglist+="<li>"+tagarray[index]+"</li>";
			}
			$('.positionlist').append('<div class="position-edit-item"><div class="row position-title"><a href="#" class="position-edit-button" data-id='+i+'>'+positions[i].name+'</a></div> <a href="#" data-id='+i+' class="position-cancel-btn"><img src="../img/fliyr_Icon_Cancel.png" style="width:12px;height:auto"/></a><ul class="taglist">'+taglist+'</ul></div>');
	    }
		$('.addposition a').html('Add Position ('+(3-positions.length)+' remaining )');
	}

	function resetPositionBox(){
		$('#positionform input[name=position]').val('');
		$('#positionform textarea[name=description]').val('');			
		$('#positionform input[name=taginput]').tagit('removeAll');
		if(3-positions.length>0){
			$('.addposition a').html('Add Position ('+(3-positions.length)+' remaining )');
		}
		else{
			$('.addposition a').html('');	
		}
	}

	$('#content').on('click','.addposition a',function(e){
		e.preventDefault();

		$('.addpositionbox').show();
		$('.addventurebox').hide();
		venturestate=false;
	});

	$('#content').on('click','.venture-delete-button',function(e){
		e.preventDefault();
		var r=confirm("This will delete this venture permanently. Are you sure you want to do that?");
		if(r){
			$.ajax({
			url:"ajax/delete-venture",
				type: "GET",
				data: { 
				  	venture_id:$(this).parent().parent().parent().attr('data-venture-id')
				},
				success: function(data, textStatus) {
					routingUpdate();
					system_notification("Your have successfully deleted your venture");
				}				  

			});

		}
	})


	$('#content').on('click','.venture-edit-button',function(e){
		e.preventDefault();
		if(!created_venture){
			
	        $.ajax({
				url: "ajax/get-venture-data",
				type: "GET",
				data: { 
				  	venture_id:$(this).parent().parent().parent().attr('data-venture-id')
				},
				success: function(data, textStatus) {
					venture=JSON.parse(data);
					positions=venture.positions;
					venturestate=true;
					console.log(positions);
					for (var i = 0; i < positions.length; i++) {
						var tagarray='';	
						positions[i].tag=positions[i].tags;
						positions[i].name=positions[i].position_name;
						for (var j = 0; j < positions[i].tags.length; j++) {
							tagarray+='#'+positions[i].tags[j].tag_name+',';
						}
					 	if (tagarray.length > 0) {
     						 tagarray = tagarray.substring(0, tagarray.length-1);
    					}
						positions[i].tags=tagarray;
						positions[i].description=positions[i].position_description;
    				}
					var Source = $("#create-venture-template").html();
			        var Template = Handlebars.compile(Source);
			        created_venture=true;
			        var HTML = Template(venture);
			        $('#content').find('div').eq(2).prepend(HTML);
			        $('.create-venture-button').html('Cancel');
	        		tagit('.taginput',null);
			        if((3-positions.length)>0)
						$('.addposition a').html('Add Position ('+(3-positions.length)+' remaining )')
					else
						$('.addposition a').html('');
					$('html, body').animate({scrollTop: '0px'}, 0);

				}				  
			});
	        
	        tagit('.taginput',null);
		}
		else{
			$('#content').find('div').eq(2).html('');
			created_venture=false;
			position={};
			$('.create-venture-button').html('Create Venture');

		}
	});

	$('#content').on('click','#ventureform .position-cancel-btn',function(e){
		e.preventDefault();
	    positions.splice($(this).attr('data-id'), 1);
	    addPositionsAgain();
	    resetPositionBox();
	});

	$('#content').on('click','.position-edit-button',function(e){
		currentPositionBeingEdited=$(this).attr('data-id');
		e.preventDefault();
		$('#positionform input[name=position]').val(positions[currentPositionBeingEdited].name);
		$('#positionform textarea[name=description]').val(positions[currentPositionBeingEdited].description);			
		$('#positionform input[name=taginput]').tagit('removeAll');
		var tagarray=positions[currentPositionBeingEdited].tags.split(',');
		for(var i=0;i<tagarray.length;i++)
			$('#positionform input[name=taginput]').tagit('createTag',tagarray[i]);
		$('.addpositionbox').show();
		$('.addventurebox').hide();
		venturestate=false;

	});


	$('#content').on('click','.finishbtn',function(e){
		e.preventDefault();
		if(venturestate){
			var name=$('#ventureform input[name=venture]').val();
			var description=$('#ventureform textarea[name=description]').val();
			var venture_id=$('#ventureform').attr('data-venture-id');
			if(name.length==0){
				alert("You can't have an empty name");
			}
			else if(description.length==0){
				alert("You can't have an empty description");
			}
			else if(positions.length==0){
				alert("You must have at least one position");
			}
			else{
				if(!$(this).hasClass('rotating-circle-used')){
					$.ajax({
						url: "ajax/add-venture",
						type: "POST",
						data: {  // to be changed later
						  	name: $('#ventureform input[name=venture]').val(),
							tags:[],
							description:$('#ventureform textarea[name=description]').val(),
							venture_id:$('#ventureform').attr('data-venture-id'),
							positions:positions
						},
						success: function(data, textStatus) {
							if(data=='ok'){
									routingUpdate();
									system_notification("Awesome! You have created/edited your venture");
								}
							}				  
						});
					$(this).addClass('rotating-circle-used');
				}
			}
		}
		else{
			if($('#positionform input[name=position]').val().length==0){
				alert("You can't have an empty name");
			}
			else if($('#positionform textarea[name=description]').val().length==0){
				alert("You can't have an empty description");
			}
			else if($('#positionform input[name=taginput]').val().length==0){
				alert("You must have at least one tag");
			}
			else{

				$('.addpositionbox').hide();
				$('.addventurebox').show();		    
				var position = {
				    name:$('#positionform input[name=position]').val(),
				    description:$('#positionform textarea[name=description]').val(),
				    tags:$('#positionform input[name=taginput]').val() 
				};
				
				//$('.positionlist').append('<div class="position-edit-item"><div class="row position-title"><a href="#" class="position-edit-button" data-id='+positions.length+'>'+position.name+'</a></div><a href="#" data-id='+positions.length+' class="position-cancel-btn"><img src="../img/fliyr_Icon_Cancel.png" style="width:12px;height:auto"/></a>  <ul class="taglist">'+taglist+'</ul></div>');
				if(currentPositionBeingEdited==-1)
				positions.push(position);
				else
					positions[currentPositionBeingEdited]=position;
				currentPositionBeingEdited=-1;
				addPositionsAgain();
				resetPositionBox()
				
				venturestate=true;

			}
		}
		
	});


	$('#content').on('click','.cancelbtn',function(e){
		e.preventDefault();

		if(venturestate){
			$('#content').find('div').eq(2).html('');
			created_venture=false;
			position={};
			$('.create-venture-button').html('Create Venture');

		}
		else{
			resetPositionBox();
			venturestate=true;
			$('.addpositionbox').hide();
			$('.addventurebox').show();				
		}
	})




});