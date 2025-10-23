// Ejemplo básico de Select2
// Requiere que select2.css esté cargado

window.$ = window.jQuery = function(selector) {
  return document.querySelector(selector);
};
window.$.fn = {
  select2: function() {
    // Simulación básica de select2
    var el = this;
    el.style.background = '#e0f7fa';
    el.style.borderRadius = '4px';
  }
};