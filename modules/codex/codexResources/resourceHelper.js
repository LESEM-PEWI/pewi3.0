/*
  This file contians all the methods that will be used in html files in the 'text' folder.


*/

// Open a desired file in a separate window
function openFiles(fileName){
  switch (fileName) {
    case 'general.pdf':
      window.open('../../../../doc/general.pdf');
      break;
    case 'advanced.pdf':
      window.open('../../../../doc/advanced.pdf');
      break;
  }
}
