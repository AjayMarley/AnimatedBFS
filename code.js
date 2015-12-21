$(function(){//On dom ready
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
                    'label':' data(label)'
        }),
        elements:{
        
            nodes:[]
        },
        motionBlur: true,
        //selectionType: 'single',
        boxSelectionEnabled: false,
        autoungrabify: true

    });
var add =function(){
    if(id >=10)
        return;
cy.add({group: 'nodes',
        data: {id:'Chris'+id, name: 'Christian'+id},
})
cy.add({group: 'edges',
        data: {id:'edge'+id, source:'Chris'+(id-1), target:'Chris'+id}
})
    id=id+1;
setTimeout(add,2000);
};
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
    

    
var add_student = function(pid, name, classn, pos, pic){
   cy.add({group: 'nodes', 
           data:{ id: pid, 
                  name: name, 
                  pic: pic 
                },
           'classes':classn
         })
}
var add_edge = function(source, target){
    id++;
    cy.add({group: 'edges',
            data:{id:source+target+id, source:source, target:target, label:id}
    });
}
var display_members = function(groupfile, discussion){
    //read the group file and store
    if(discussion == 'stopped'){
        jQuery.get(groupfile, function(data){
        //console.log(data);         
        console.log("---");
        namelist = data.split(',');
        })
         var namelist = [ {name:"Nikola Tesla", dp:'nikolas'},
                          {name:"Ludwig Van Beethoven",dp:'ludwig'},
                          {name:"Lenardo da Vinci",dp:'leo'},
                          {name:"Srinivasa Ramanujan",dp:'srini'},
                          {name:"Galileo Galilei",dp:'galileo'},
                          {name:"Isaac Newton",dp:'isaac'},
                          {name:"Charles Darwin",dp:'darwin'},
                          {name:"Alan Turing",dp:'alan'},
                          {name:"Ada lovelace",dp:'ada'},
                          {name:"Charles Babbage",dp:'babbage'},
                          {name:"Albert Einstein",dp:'albert'}   
                         ];
        //discussion = 'started';
        var first_session = Math.ceil(namelist.length/2);
        console.log(first_session);
        var second_session = namelist.length - first_session;
        pos = {'x':0, 'y':0}
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
var toggle_node = function(element){
    //make node active/inactive
}
display_members('groupa.txt', 'stopped');
});

