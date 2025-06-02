/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

(function() {
  // prints "hi" in the browser's dev tools console
  console.log('hi');
  
  const form = document.forms[0]; //Full form for JSON input
  const textarea = document.getElementById("inputJSON") //Input box for JSON
  // const http = require('https');
  

  // Suppress any dragover events that interfere with drop
  textarea.ondragover = e => {
      e.preventDefault();
    };
  
  // On drop, read file as text and display in textarea
  textarea.ondrop = function(e) {
    e.preventDefault();
    let files = e.dataTransfer.files;
    let reader = new FileReader();
    reader.onload = e => {
      this.value = e.target.result;
    }
    for (let i=0;i<files.length;i++) {
      reader.readAsText(files[i]);
    }
  };
  
  // listen for the form to be submitted and add a new dream when it is
  form.onsubmit = function(event) {
    // stop our form submission from refreshing the page
    event.preventDefault();
    
    let data = textarea.value;
    let idList = data.split("\n").map(m => m.split(",")[0]);
    let zip = new JSZip();
    const archive = zip.folder("texts");

    
    idList.forEach((tcp, index, array) => {
      const fileUrl = `https://bitbucket.org/eads004/${tcp.slice(0,3)}/raw/master/${tcp}.xml`;
      console.log(fileUrl);
      fetch(fileUrl).then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(xmlBlob => {
            zip.folder("texts").file(`${tcp}.xml`, xmlBlob);
            if (index === array.length -1) zip.generateAsync({type:"blob"}).then(function(content) {
                content.name = "texts.zip"
                console.log(content);
                // Force down of the Zip file
                downloadFile(content);
            });
      })
      .catch(error => {
          console.error(`There was a problem with
                         the fetch operation:`, error);
      });
    });
  };
  
function downloadFile(file) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(file);
  link.download = file.name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.parentNode.removeChild(link);
  }, 0);
}

  
})();