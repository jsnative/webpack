import { Component, TextArea, Container, Label, Span } from '@core/components';
import { ContainerResize, KeyContainer } from '../themes/app-theme';

import '../assets/fira-code/fira_code.css';
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import '../themes/native-codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/comment/comment.js';

export default class Editor extends Component {

  Pref = undefined;
  textArea; editor;
  filename = "Preferences.js";

  constructor() {
    super();
    this.Pref = Config.UserPreferences.workspace.editor;
    KeyContainer(this, {
      'ctrl+s': () => this.editor && this.editor.save()
    })
    const defaultEditorWidth = (window.innerWidth * 0.44);
    this.background(this.Pref.background || Theme.Colors.Editor.background)
      .size('auto',  '100vh')
      .paddingRight(8)
      .borderLeft('2px solid ' + Theme.Colors.black);
    this.textArea = new TextArea()
      .size('100%', 'calc(100% - 40px)')
      .backgroundColor(this.Pref.background || Theme.Colors.Editor.background)
      .border(0).outline(0).color(Theme.Colors.white)
      .value("Hello world, this tolu speaking")
      .fontFamily('"Consolas", Courier');
    this.addChild(
      new Container().size('100%', 34)
        .display('flex')
        .alignItems('center')
        .padding(10)
        .addChild(
          new Span()
            .addClassName('ic-js-small')
            .color(Theme.Colors.orange)
            .fontSize(20)
            .marginRight(6),
          new Label().text(this.filename)
            .color(Theme.Colors.Panel.darkText2)
            .fontSize(Theme.Fonts.normal)
        )
    )
    this.addChild(this.textArea);
    // this.addChild(new ContainerResize({ min: 240, max: 450 }));
  }

  onCreate() {
    var ExcludedIntelliSenseTriggerKeys = { "8": "backspace", "9": "tab", "13": "enter", "16": "shift", "17": "ctrl", "18": "alt", "19": "pause", "20": "capslock", "27": "escape", "33": "pageup", "34": "pagedown", "35": "end", "36": "home", "37": "left", "38": "up", "39": "right", "40": "down", "45": "insert", "46": "delete", "91": "left window key", "92": "right window key", "93": "select", "107": "add", "109": "subtract", "110": "decimal point", "111": "divide", "112": "f1", "113": "f2", "114": "f3", "115": "f4", "116": "f5", "117": "f6", "118": "f7", "119": "f8", "120": "f9", "121": "f10", "122": "f11", "123": "f12", "144": "numlock", "145": "scrolllock", "186": "semicolon", "187": "equalsign", "188": "comma", "189": "dash", "191": "slash", "192": "graveaccent", "220": "backslash", "222": "quote"}

    const wait = setInterval(() => {
      if(this.textArea.node()) {
        clearInterval(wait);
        this.editor = CodeMirror.fromTextArea(this.textArea.node(), {
          mode: { name: 'javascript', globalVars: true },
          extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Ctrl-/': (cm) => { cm.toggleComment({ indent: true }) },
            'Ctrl-S': (cm) => { cm.save() }
          },
          lineNumbers: true,
          lineWrapping: true,
          // fixedGutter: true,
          gutter: true,
          theme: 'native-codemirror',
          styleActiveLine: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          showHint: true,
          scrollbarStyle: 'simple',
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          toggleComment: { indent: true },
          indentWithTabs: true,
          tabSize: 2
        });
        this.editor.on("keyup", (editor, event) => {
          const cursor = this.editor.getDoc().getCursor();
          const token = this.editor.getTokenAt(cursor);
          if (!this.editor.state.completionActive
            && !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()]
            && (token.type == "tag" || token.type == "variable" || token.string == " " || token.string == "<" || token.string == "/" || token.string == ".")
          ) {
            CodeMirror.commands.autocomplete(this.editor, null, { completeSingle: false });
          }
        });
        const indentGuidesOverlay = {
          name: 'indentLines',
          token: (stream) => {
            var char = "",
              colNum = 0,
            char = stream.next();
            colNum = stream.column();

            // Check for "hide first guide" preference
            if (colNum === 0) { return "left-guide"; }
            if (char === "\t") { return "left-guide"; }
            if (char !== " ") {
              stream.skipToEnd();
              return null;
            }
            return "left-guide";
          },
          flattenSpans: false
        }
        const updateUI = () => {
          if (this.editor) {
            this.editor.removeOverlay(indentGuidesOverlay);
            this.editor.addOverlay(indentGuidesOverlay);
            this.editor.refresh();
          }
        }
        this.editor.on('change', updateUI);
        this.editor.on('change', function(cm, change) {
          if(change.text.length < 2) return;
          if(change.origin != "paste" && change.origin != "setValue") return;
          cm.operation(function() {
            for (var line = change.from.line, end = CodeMirror.changeEnd(change).line; line < end; ++line)
              cm.indentLine(line, "smart");
          });
        });
        this.editor.setValue(`function major() {
  const major = "Let it rip";
  if(major.split().length > 0) {
    major.split().forEach(i => {
      console.log(i);
    })
  }
}

function checkingIn() {
  // an attempt to check-in
  Main.getDoc().onLoad((major) => {
    // starting the process
    if(major === "something special") {
      // then make the process workd
      this.spawn("new process", major.init()).then(res => {
        console.log("Starting new process");
        res.makeReason("We are getting ready!").then(res => {
          res.makeMajor("We are coming for you now");
          // load the process into the queue
          major.queue.addProcess(res.newProcess());
          if(major.queue.getNewProcess()) {
            major.sprintForward();
            major.makeNewRequest().then(res => {
              console.log(res);
              major.clean();
              major.quit();
            })
          }
        })
      })
    }
  })
}`)
      };
    }, 100);
  }
}
