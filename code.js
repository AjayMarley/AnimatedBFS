$(function(){//On dom ready
	
	var namelist;
	//Get the student list
	document.getElementById("studentfile").addEventListener('change',function(){
        console.log(this.files[0]);
        if(this.files[0] != null){
			var fr = new FileReader();
			fr.onload = function(){
				    namelist = this.result;
			    	console.log(typeof(namelist));
                    display_members(namelist, 'stopped');
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
    console.log(namelist);
    var total = 0;
    var prev = -1
    var id = -1;
    // discussion refers to the entire session
    //Can hold 3 states 'started', 'suspended', 'stopped'
    var discussion = 'stopped' 
    var cy = cytoscape({
        container: document.getElementById('cy'),
        style: cytoscape.stylesheet()
        .selector('node')
            .css({
            'height': 80,
            'width': 80,
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 3,
            'border-opacity': 0.5,
            'content' :'data(name)',
            'selectable' : true,
            'grabbable' :true,
            'locked' :true,
        })
        .selector('.nikolas')
            .css({
                'background-image':'nikolas.jpg'
                })
        .selector('.albert')
            .css({
                'background-image':'albert.jpg'
                })
        .selector('.isaac')
            .css({
                'background-image':'isaac.jpg'
                })
        .selector('.srini')
            .css({
                'background-image':'srini.jpg'
                })
        .selector('.leo')
            .css({
                'background-image':'leo.jpg'
                })
        .selector('.galileo')
            .css({
                'background-image':'galileo.jpg'
                })
        .selector('.alan')
            .css({
                'background-image':'alan.jpg'
                })
        .selector('.darwin')
            .css({
                'background-image':'darwin.jpg'
                })
        .selector('.ludwig')
            .css({
                'background-image':'ludwig.jpg'
                })
        .selector('.babbage')
            .css({
                'background-image':'babbage.jpg'
                })
        .selector('.ada')
            .css({
                'background-image':'ada.jpg'
                })

        .selector('edge')
            .css({
                    'transition-time':'3.0s',
                    'target-arrow-shape': 'triangle',
                    'label':' data(label)',
				    'curve-style': 'bezier',
                	'control-point-step-size': 40
        }),
        elements:{
        
            nodes:[]
        },
        motionBlur: true,
        //selectionType: 'single',
        boxSelectionEnabled: false,
        autoungrabify: true

    });
	 //I am selecting a circular layout for the nodes
	 var options = {
	   name: 'circle',

	   fit: true, // whether to fit the viewport to the graph
	   padding: 30, // the padding on fit
	   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	   avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
	   radius: 300, // the radius of the circle
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
	 
	 
//select event handler
cy.on('select', 'node', function(event){
    id++;
    if(prev == -1){
        prev = this;
        console.log("First Click"+prev.data().name);
        // highlight(node);
    }
    else{
        //console.log("Adding edges between"+ prev.data().name +"and" + this.data().name); 
        cy.add({group: 'edges',
                data: {id:prev.id()+this.id()+id, source:prev.id(), target:this.id(), label:id}
        })
        prev= this;
    }
});
    

//Node addition    
var add_student = function(name, classn, pic){
   cy.add({group: 'nodes', 
           data:{ id: name, 
                  name: name, 
                  pic: pic 
                },
           'classes':classn,
			  renderedPosition:pos 
         })
}

var display_members = function(namelist, discussion){
    //read the group file and store
    if(discussion == 'stopped'){
        console.log("Namelist %s", namelist);
        namelist = namelist.split('\n');
        //This will store in namelist comma separated arrays of Name and image
        console.log("After Split %s", namelist[0]);
        discussion = 'started';
        var first_session = Math.ceil(namelist.length/2);
        console.log(first_session);
        var second_session = namelist.length - first_session;
		  //{ x: 800, y: 800 }
        while(first_session>0){
            --first_session;
            //Randomly add students to discussion
            var stud = namelist[Math.floor(Math.random()*namelist.length)];
            console.log("Student name:"+stud);
            add_student(stud.name, stud.name, stud.dp,pos, pos);
            //In a less likely event of name not in array
            if(namelist.indexOf(stud) != -1){
                //1 because I want to remove one element
                namelist.splice(namelist.indexOf(stud),1);
                console.log(namelist);
            }
        }
		  cy.layout(options)
		  cy.centre()
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

