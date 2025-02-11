/**javascript file to handle the UX features of the program */

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
  cell.addEventListener('mouseover', function() {
    cell.style.transform = 'scale(0.65)';
  });
  
  cell.addEventListener('mouseout', function() {
    cell.style.transform = 'scale(1)';
  });
});