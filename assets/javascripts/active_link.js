var activeParents =$('.active').parents("ul");    
console.log(activeParents);
for (let i = 0; i < activeParents.length; i++) {
    var e = $(activeParents[i]); 
    
    console.log(e);

    e.addClass("collapse in");
    e.attr("aria-expanded","true");

    var a = e.prev();

    a.removeClass("collapsed");
    a.attr("aria-expanded","true");


}