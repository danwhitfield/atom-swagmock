'use babel';

import AtomSwagmockView from './atom-swagmock-view';
import { CompositeDisposable } from 'atom';

export default {

  atomSwagmockView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-swagmock:generate': () => this.generate()
    }));

    atom.workspace.addOpener(uriToOpen => {
      uriParts = uriToOpen.split('://');
      protocol = uriParts[0];
      path = uriParts[1];

      if (protocol !== 'atom-swagmock') {
        return;
      }

      try {
        path = decodeURI(path)
      } catch(err) {
        console.log(err);
        return;
      }

      if (path.startsWith('editor/')) {
        this.atomSwagmockView = new AtomSwagmockView({
          editorId: path.substring(7)
        });

        return this.atomSwagmockView;
      }
    });
  },

  deactivate() {
    this.subscriptions.dispose();
    this.atomSwagmockView.destroy();
  },

  serialize() {},

  generate() {
    console.log('AtomSwagmock was toggled!');

    const editor = atom.workspace.getActiveTextEditor();
    const uriForEditor = `atom-swagmock://editor/${editor.id}`;
    const previousActivePane = atom.workspace.getActivePane();

    atom.workspace.open(uriForEditor, {});
  }
};
