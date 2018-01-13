'use babel';

import _ from 'lodash';
import Swagmock from 'swagmock';

export default class AtomSwagmockView {

  constructor(state) {
    this._resolveEditor(state.editorId)
      .then(editor => {
        this.editor = editor;
        this._renderView();
      });
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getTitle() {
    return "Atom Swagmock: Mock Data JSON";
  }

  _renderView() {
    if (this._isYaml()) {
      const loadingMessage = document.createElement('div');
      loadingMessage.textContent = 'Loading...';
      this.element = document.createElement('div');
      this.element.classList.add('atom-swagmock');

      this.element.appendChild(loadingMessage);

      Swagmock(this.editor.getPath())
        .responses({ useExamples: true })
        .then(mock => {
          loadingMessage.remove();

          const message = document.createElement('div');
          message.textContent = JSON.stringify(mock, null, '  ');
          message.classList.add('message');
          this.element.appendChild(message);
        });
    }
  }

  _isYaml() {
    const grammar = this.editor.getGrammar(),
      title = this.editor.getTitle();

    if (grammar.name === 'YAML') {
      return true;
    }

    if (_.endsWith(title, '.yaml') || _.endsWith(title, '.yml')) {
      return true;
    }

    return false;
  }

  _resolveEditor(editorId) {
    const findTextEditorById = () => _.find(atom.workspace.getTextEditors(), e => e.id == editorId);

    return new Promise(resolve => {
      if (atom.packages.hasActivatedInitialPackages()) {
        resolve(findTextEditorById());
      } else {
        atom.packages.onDidActivateInitialPackages(() => {
          resolve(findTextEditorById());
        });
      }
    });
  }
}
