/**javascript file to handle the UX features of the program */

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
  cell.addEventListener('mouseover', function() {
    cell.style.border = '5px solid var(--color-white)';
  });
  
  cell.addEventListener('mouseout', function() {
    cell.style.scale = '1';
    cell.style.border = '3px solid var(--color-control-border)';
  });
});