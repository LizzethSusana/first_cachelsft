// main.js
// Aquí puedes agregar lógica común para todas las páginas si lo necesitas

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw.js')
			.then(function(reg) {
				console.log('Service Worker registrado:', reg.scope);
			})
			.catch(function(err) {
				console.error('Error al registrar el Service Worker:', err);
			});
	});
}