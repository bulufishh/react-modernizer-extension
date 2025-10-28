
document.addEventListener('DOMContentLoaded', function() {

  const codeInput = document.getElementById('codeInput');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exampleBtn = document.getElementById('exampleBtn');
  const legacyCode = document.getElementById('legacyCode');
  const modernCode = document.getElementById('modernCode');
  const migrationNotes = document.getElementById('migrationNotes');
  const loader = document.getElementById('loader');
  const charCount = document.getElementById('charCount');
  const lineCount = document.getElementById('lineCount');
  const notesCount = document.getElementById('notesCount');
  const stats = document.getElementById('stats');
  const copyButtons = document.querySelectorAll('.btn-copy');


  chrome.storage.local.get(['conversionCount'], function(result) {
    const count = result.conversionCount || 0;
    stats.textContent = `Conversions: ${count}`;
  });

  codeInput.addEventListener('input', function() {
    const text = codeInput.value;
    const characters = text.length;
    const lines = text.split('\n').length;
    
    charCount.textContent = `Characters: ${characters}`;
    lineCount.textContent = `Lines: ${lines}`;
  });


  clearBtn.addEventListener('click', function() {
    codeInput.value = '';
    legacyCode.querySelector('code').textContent = 'No code loaded...';
    modernCode.querySelector('code').textContent = 'Conversion will appear here...';
    migrationNotes.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-lightbulb"></i>
        <p>No notes yet. Convert some code to see migration notes.</p>
      </div>
    `;
    notesCount.textContent = '0 items';
    charCount.textContent = 'Characters: 0';
    lineCount.textContent = 'Lines: 0';
  });

  exampleBtn.addEventListener('click', function() {
    const exampleCode = `class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: 'John'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}!</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>Increment</button>
      </div>
    );
  }
}`;

    codeInput.value = exampleCode;
    codeInput.dispatchEvent(new Event('input'));
  });

  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      const code = targetElement.querySelector('code').textContent;
      
      navigator.clipboard.writeText(code).then(() => {

        const originalIcon = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          this.innerHTML = originalIcon;
        }, 1000);
      });
    });
  });


  convertBtn.addEventListener('click', function() {
    const inputCode = codeInput.value.trim();
    
    if (!inputCode) {
      alert('Please enter some React code to convert.');
      return;
    }


    loader.classList.remove('hidden');
    

    setTimeout(() => {
      performConversion(inputCode);
      loader.classList.add('hidden');
      

      chrome.storage.local.get(['conversionCount'], function(result) {
        const count = (result.conversionCount || 0) + 1;
        chrome.storage.local.set({conversionCount: count});
        stats.textContent = `Conversions: ${count}`;
      });
    }, 800);
  });

  function performConversion(code) {

    legacyCode.querySelector('code').textContent = code;
    

    let convertedCode = code;
    const notes = [];
    
  
    if (code.includes('class') && code.includes('extends React.Component')) {
      const className = code.match(/class\s+(\w+)\s+extends/)?.[1] || 'MyComponent';
      convertedCode = convertedCode.replace(
        /class\s+\w+\s+extends\s+React\.Component\s*{/,
        `const ${className} = () => {`
      );
      notes.push('Converted class component to functional component');
    }
    

    if (code.includes('this.state')) {
      convertedCode = convertedCode.replace(
        /constructor\(props\)\s*{[\s\S]*?this\.state\s*=\s*{([\s\S]*?)}[\s\S]*?}/,
        ''
      );
      convertedCode = convertedCode.replace(
        /this\.state\s*=\s*{([\s\S]*?)}/,
        'const [state, setState] = useState({$1})'
      );
      notes.push('Replaced constructor with useState hook');
    }
    

    convertedCode = convertedCode.replace(/this\.setState\(/g, 'setState(');
    

    if (code.includes('componentDidMount')) {
      convertedCode = convertedCode.replace(
        /componentDidMount\(\)\s*{([\s\S]*?)}/,
        'useEffect(() => {$1}, [])'
      );
      notes.push('Replaced componentDidMount with useEffect hook');
    }
    
 
    convertedCode = convertedCode.replace(/this\.state\./g, 'state.');
    

    convertedCode = convertedCode.replace(/\s+render\(\).*?{/, '');
    convertedCode = convertedCode.replace(/}\s*$/, '');
    
  
    if (!convertedCode.includes('useState') && convertedCode.includes('useState')) {
      convertedCode = `import React, { useState, useEffect } from 'react';\n\n${convertedCode}`;
      notes.push('Added React hooks imports');
    } else if (!convertedCode.includes('useState') && convertedCode.includes('useState')) {
      convertedCode = `import React, { useState } from 'react';\n\n${convertedCode}`;
      notes.push('Added React hooks imports');
    }
    
   
    modernCode.querySelector('code').textContent = convertedCode;
    

    if (notes.length > 0) {
      migrationNotes.innerHTML = `
        <ul>
          ${notes.map(note => `<li>${note}</li>`).join('')}
        </ul>
      `;
      notesCount.textContent = `${notes.length} items`;
    } else {
      migrationNotes.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-lightbulb"></i>
          <p>No conversion needed or no changes detected.</p>
        </div>
      `;
      notesCount.textContent = '0 items';
    }
  }
});