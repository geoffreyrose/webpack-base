import * as the_functions  from './functions';
import { test3 } from './functions-2';

(function($) {
    "use strict";
    $(function(){

        the_functions.test1();
        the_functions.test2();
        test3();
        setTimeout(() => {
            $('h1').text('Goodbye!');
        }, 2000);

    });
})(jQuery);
