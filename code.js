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
    var total = 0;
    var prev = -1
    var prevd = new Date();
    var curd = new Date();
    var edge_id = -1;
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
            'content' :'data(summary)',
            'background-image': 'data(pic)',
            'selectable' : true,
            'grabbable' :true,
            'locked' :true,
            //'min-zoomed-font-size': '7',
            'text-wrap' : 'wrap'
        })

        .selector('edge')
            .css({
                    'transition-time':'3.0s',
                    'line-color': '#ccc',
                    'width': 3,
                    'target-arrow-shape': 'triangle',
                    'label':' data(label)',
                    'min-zoomed-font-size': '10',
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
	 /*var options = {
	   name: 'circle',

	   fit: true, // whether to fit the viewport to the graph
	   padding: 30, // the padding on fit
	   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	   avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
	   radius: 20, // the radius of the circle
	   startAngle: 3/2 * Math.PI, // where nodes start in radians
	   sweep: undefined,//undefined, // how many radians should be between the first and last node (defaults to full circle)
	   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
	   sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
	   animate: false, // whether to transition the node positions
	   animationDuration: 500, // duration of animation in ms if enabled
	   animationEasing: undefined, // easing of animation if enabled
	   ready: undefined, // callback on layoutready
	   stop: undefined // callback on layoutstop
	 };
	*/ 
    var options = { name:'spread', minDist:200};
	 
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
        this.data(this.data())
        prev= this;
        prevd = curd;
    }
});
    

//Node addition    
var add_student = function(id, name, pic){
   var count = 0;
   var duration =0;
   cy.add({group: 'nodes', 
           data:{ id: id, 
                  name: name, 
                  pic: pic, 
                  count: count,
                  duration: duration,
                  summary: name+ '\nC:' + count + '\nD:' + duration + 'secs'
                },
        //  'classes':classn,
        //Layout options takes care of position
		//  renderedPosition:pos 
         });
};

var display_members = function(namelist, discussion){
    //read the group file and store
    if(discussion == 'stopped'){
        console.log("Namelist %s", namelist);
        namelist = namelist.split('\n');
        //This will store in namelist comma separated arrays of Name and image
        console.log("After Split %s", namelist[0]);
        discussion = 'started';
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
document.getElementById("generatepng").addEventListener('click', function(){

    
  var png = cy.png({full:true});
  document.getElementById("imagePng").attr('src') = png;
  console.log("Image generated");
});
//display_members('groupa.txt', 'stopped');
var toggle_node = function(element){
    //make node active/inactive
}
});

