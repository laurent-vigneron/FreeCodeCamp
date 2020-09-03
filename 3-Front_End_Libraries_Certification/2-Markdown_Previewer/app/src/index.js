import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import DOMPurify from 'dompurify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: `# React Markdown Previewer
## This is a sub-heading...
### And here's some other cool stuff:

**bold** | _italic_ | **_bold & italic_** | ~~crossed~~

Some in-line code: \`<div></div>\`

\`\`\`
// multi-line code
function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

[link to FreeCodeCamp.Org](https://www.freecodecamp.com)
> Block Quote

- List
  - Of stuff
    - at different levels

1. Numbererd list
2. That goes on... 

![React Logo w/ Text](https://techchronos.com/wp-content/uploads/SszarkLabs/stack-icon/cywBkaGwkMeDAuJbSt1k.png)
`
    }
  }
  handleChange = (e) => {
    this.setState({
      input: e.target.value});
  }
  render() {
    return (<div className='row card-deck'><Editor input={this.state.input} handleChange={this.handleChange}/><Translator input={this.state.input}/></div>)
  }
}

class Editor extends React.Component {
  render() {
    return (
      <div className='col-sm'>
        <div className='card border-info'>
          <div className="card-header bg-info"><strong>Editor</strong></div>
          <div className='card-body'>
            <div className='card-text form-group'>
              <textarea className='text-info form-control' id='editor' value={this.props.input} onChange={this.props.handleChange} />
            </div>
          </div>
        </div>
      </div>);
  }
}

class Translator extends React.Component {
  constructor(props) {
    super(props);
    marked.setOptions({
      breaks: true
    });
  }
  render() {
    return (
      <div className='col-sm'>
        <div className='card border-success'>
          <div className="card-header bg-success"><strong>Previewer</strong></div>
          <div className='card-body'>
            <div id='preview' className='card-text' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(this.props.input))}}>  
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


