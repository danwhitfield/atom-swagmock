'use babel';

import AtomSwagmockView from './atom-swagmock-view';
import { CompositeDisposable } from 'atom';

export default {

  atomSwagmockView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomSwagmockView = new AtomSwagmockView(state.atomSwagmockViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomSwagmockView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-swagmock:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomSwagmockView.destroy();
  },

  serialize() {
    return {
      atomSwagmockViewState: this.atomSwagmockView.serialize()
    };
  },

  toggle() {
    console.log('AtomSwagmock was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
