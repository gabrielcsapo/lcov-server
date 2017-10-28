import 'psychic.css/dist/psychic.min.css';

import { configure } from '@storybook/react';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
