$(function(){//On dom ready
	
	var namelist;
    // discussion refers to the entire session
    //Can hold 3 states 'started', 'suspended', 'stopped'
    var discussion = 'stopped' 
	//Get the student list
    var total = 0;
    var prev = -1
    var prevd = new Date();
    var curd = new Date();
    var edge_id = -1;
 
 	 var textFile = null;
	 var makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
	 console.log(textFile);
    return textFile;
  };
    var cy = cytoscape({
        container: document.getElementById('cy'),
        style: cytoscape.stylesheet()
        .selector('node')
            .css({
            'height': 150,
            'width': 150,
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 5,
            'border-opacity': 1,
            //'content' :'data(summary)',
            'background-image': 'data(pic)',
            'selectable' : true,
            'grabbable' :true,
				'autolock': false,
            //'min-zoomed-font-size': '10',
            'text-wrap' : 'wrap'
        })

        .selector('edge')
            .css({
                    'transition-duration':'30s',
                    'line-color': '#222',
                    'width':5,
                    'target-arrow-shape': 'triangle',
						   'target-arrow-color': '#222',
                    'label':' data(label)',
							'color': '#f00',
							'font-size': '50',
							'line-style': 'dotted',
                    	'min-zoomed-font-size': '10'
        })
		  .selector('.show_info')
		  		.css({
		  				'content' :'data(summary)',
						'color': '#fff',
						'background-color': '#000',
						'font-size': '40',
					'font-weight':'bold',
					'text-border-color':'#000',
					'text-border-width':'15',
					'text-background-opacity':'0.4',
					'text-background-color':'#000',
					'font-family': 'Helvetica',
						'text-valign': 'center',
                	'text-halign': 'center',
					'text-border-opacity':'0.7'
		 		})
			.selector('.best')
				.css({
					'border-width':15,
					'border-color':'#0F0',	
				})
			.selector('.good')
				.css({
					'border-width':10,
					'border-color':'#FF0'
				}),
        elements:{
        
            nodes:[]
        },
        'motionBlur': true,
        //selectionType: 'single',
        'boxSelectionEnabled': false,
		  //'autounselectify': true
		  ready: function(){
			  //Generate PNG Function Handler
			  document.getElementById("generatepng").addEventListener('click', function(){
			  	console.log("Discussion in Handler:",discussion);
			  	if(discussion == 'started'){
			  		//var jpg =  	cy.jpg();
			  		//console.log(jpg);
			  		var json = cy.json();
			  		//write json to a file
			  		console.log("Writing to File");
			  		console.log(json);
			  		var link = document.getElementById("downloadlink");
				   link.href = makeTextFile(JSON.stringify(json));
			  		//$('#imagePng').attr('src',png);
			  		console.log("Image generated");
			  	}else{
			  		console.log("Discussion:%s", discussion);
			  	}
			  });
			  
			  //Read the student file Function handler
		  	document.getElementById("studentfile").addEventListener('change',function(){
		          console.log(this.files[0]);
		          if(this.files[0] != null){
		  			var fr = new FileReader();
		  			fr.onload = function(){
		  				    namelist = this.result;
		  			    	console.log(typeof(namelist));
		                      
		  			}
		              var mimetype = this.files[0].type;
		              if ( mimetype == 'text/plain'){
		                  console.log("File Uploaded..")       
		                  fr.readAsText(this.files[0]);
		              }
		  		    else{
		  			    console.log("File format not supported %s", mimetype);
		  		    }
		          }
		          else{
		              console.log("No file selected");
		          }
		  	}); 
		  document.getElementById("startgraph").addEventListener('click', function(){
			  console.log(namelist);
			  if(typeof(namelist) == 'undefined'){
				  alert('Wooohooo! Forgot to select Namelist file?!');
				  return;
			  }
		  		display_members(namelist);
		  });
	  }

    });
	 //I am selecting a circular layout for the nodes
	 var options = {
	   name: 'circle',

	   fit: true, // whether to fit the viewport to the graph
	   padding: 5, // the padding on fit
		condense: true,
	   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	   avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
	   radius: 4, // the radius of the circle
	   startAngle: 3/2 * Math.PI, // where nodes start in radians
	   sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
	   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
	   sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
	   animate: false, // whether to transition the node positions
	   animationDuration: 500, // duration of animation in ms if enabled
	   animationEasing: undefined, // easing of animation if enabled
	   ready: undefined, // callback on layoutready
	   stop: undefined // callback on layoutstop
	 };
	 var options1 = { name:'grid', minDist:50};
	 var options2 = {
	   name: 'circle',

	   fit: false, // whether to fit the viewport to the graph
	   padding: 2, // the padding on fit
		 condense: true,
	   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	   avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
	   radius: 1, // the radius of the circle
	   startAngle: undefined, // where nodes start in radians
	   sweep: undefined,//undefined, // how many radians should be between the first and last node (defaults to full circle)
	   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
	   sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
	   animate: false, // whether to transition the node positions
	   animationDuration: 500, // duration of animation in ms if enabled
	   animationEasing: undefined, // easing of animation if enabled
	   ready: undefined, // callback on layoutready
	   stop: undefined // callback on layoutstop
	 };
    
	 /*var options = {
	   name: 'concentric',

	   fit: true, // whether to fit the viewport to the graph
	   padding: 30, // the padding on fit
	   startAngle: 3/2 * Math.PI, // where nodes start in radians
	   sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
	   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
	   equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
	   minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
	   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	   avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
	   height: undefined, // height of layout area (overrides container height)
	   width: undefined, // width of layout area (overrides container width)
	   concentric: function(node){ // returns numeric value for each node, placing higher nodes in levels towards the centre
			var rand = Math.random()*40*4;
			console.log(rand);
	   return rand;
	   },
	   levelWidth: function(nodes){ // the variation of concentric values in each level
	   return nodes.maxDegree() / 4;
	   },
	   animate: false, // whether to transition the node positions
	   animationDuration: 500, // duration of animation in ms if enabled
	   animationEasing: undefined, // easing of animation if enabled
	   ready: undefined, // callback on layoutready
	   stop: undefined // callback on layoutstop
	 };*/
	
	 
//select event handler
cy.on('select', 'node', function(event){
    edge_id++;
    if(prev == -1){
        prevd = new Date();
        console.log("First Click"+ this.data().name);
        // highlight(node);
        this.data().summary = this.data().name+ '\n C: ' + ++this.data().count + '\n D: ' + this.data().duration + ' secs'; 
        this.data(this.data())
        prev = this;
		  //scoring formula
		  this.addClass('good');
        console.log(this.id);
    }
    else{
        curd = new Date();
        prev.data().duration += Math.round((curd.getTime() - prevd.getTime())/1000);
        console.log("Adding edges between"+ prev.data().name +" and " + this.data().name); 
        cy.add({group: 'edges',
                data: {id:prev.id()+this.id()+edge_id, source:prev.id(), target:this.id(), label:edge_id}
        })
        prev.data().summary = prev.data().name+ '\n C: ' + prev.data().count + '\n D: ' + prev.data().duration + ' secs';
        prev.data(prev.data());
        this.data().count = this.data().count+1;
        this.data(this.data());
		  //scoring formula
		  if(this.data().count > 5 || this.data().duration == 60){
			  this.addClass('best');
		  }
        prev= this;
        prevd = curd;
    }
});
    
cy.on('mouseover','node', function(event){
	console.log(event);
	//add class to display label
	this.addClass('show_info');
	
});
cy.on('mouseout', 'node', function(event){
	console.log(event);
	this.removeClass('show_info');
	//add class to hide label
})
//Node addition    
var add_student = function(id, name, pic){
   var count = 0;
   var duration =0;
   cy.add({group: 'nodes', 
           data:{ 'id': id, 
                  'name': name, 
                  'pic': pic, 
                  'count': count,
                  'duration': duration,
                  'summary': name+ '\nC:' + count + '\nD:' + duration + 'secs',
				  		"removed":false,
						"selected":false,
						"selectable":true,
						"locked":false,
						"grabbable":true
                }
        //  'classes':classn,
        //Layout options takes care of position
		//  renderedPosition:pos 
         });
};

var display_members = function(namelist){
	//read the group file and store
	if(discussion == 'stopped'){
		discussion = 'started';
		console.log("Inside Display members Discussion=",discussion)
		console.log("Namelist %s", namelist);
		namelist = namelist.split('\n');
		//This will store in namelist comma separated arrays of Name and image
		console.log("After Split %s", namelist[0]);
		var index = 0;
		var first_session = namelist.length-1//Math.ceil(namelist.length/2);
		console.log("Number of students in first session =%d",first_session);
		var second_session = namelist.length - first_session;
		while(index < first_session){

			//--first_session;
			//Randomly add students to discussion
			//var index = Math.floor(Math.random()*(namelist.length-1));
			//Note:namelist -1 because '\n' is adding an empty element
			//Need to figure out how to do it elegantly
			var stud ={ id:index, name:namelist[index].split(',')[0], pic:namelist[index].split(',')[1] }
			console.log("Student Name: %s, Student picture: %s", stud.name, stud.pic);
			add_student(stud.id, stud.name, stud.pic);
			index++;
			//1 because I want to remove one element
			//namelist.splice(index, 1);
			//console.log(namelist);
		}
		var eles1 = cy.nodes("[id<=7]");
		eles1.layout(options);
		var eles2 = cy.nodes("[id>7]");
		eles2.layout(options);
		cy.centre();
		console.log(namelist.length);
		console.log(namelist);
	}    
   else if(discussion == 'suspended')
   {
        //Second circle empty the name list
        //add  participants to group and update
   }else{
        //Time to stop the discussion and cleanup 
        //Show some characteristics and terminate

    
   }

}


//display_members('groupa.txt', 'stopped');
var toggle_node = function(element){
    //make node active/inactive
}
});

