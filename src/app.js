import 'whatwg-fetch';
import 'psychic-ui/dist/psychic-min.css';
import './style.css';

import { render } from 'react-dom';
import routes from './router';

render(routes, document.querySelector('#root'));
