import * as the_functions  from './functions';
import { test3 } from './functions-2';

(function($) {
    "use strict";
    $(function(){

        the_functions.test1();
        the_functions.test2();
        test3();

        $('h1').text('Goodbye');
    });
})(jQuery);
