$(function(){
    var subjects = ['Ajay','PHP', 'MySQL', 'SQL', 'PostgreSQL', 'HTML', 'CSS', 'HTML5', 'CSS3', 'JSON'];
    $('#search').typeahead({
        source: subjects});
});