import initModel from './modules/Model';
import update from './modules/Update';
import view from './modules/View';
import app from './modules/App';

const node = document.getElementById('app');

app(initModel, update, view, node);
