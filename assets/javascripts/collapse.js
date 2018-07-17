$('.collapse').each(function () {
    $(this).on('shown.bs.collapse', function () {
        var a = $(this).prev();

        if (a.attr("aria-expanded") === "true" ) {
            var span = a.children(".glyphicon");
            span.addClass("glyphicon-triangle-bottom");
            span.removeClass("glyphicon-triangle-right");
        }
    });

    $(this).on('hidden.bs.collapse', function () {
        var a = $(this).prev();

        if (a.attr("aria-expanded") === "false") {

            var span = a.children(".glyphicon");
            span.removeClass("glyphicon-triangle-bottom");
            span.addClass("glyphicon-triangle-right");
        }
    });

})