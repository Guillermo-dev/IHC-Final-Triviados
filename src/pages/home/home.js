const botones = document.querySelectorAll('[data-js=button]');

botones[0].onclick = () => {location.href = `/pregunta/easy`};
botones[1].onclick = () => {location.href = `/pregunta/medium`};
botones[2].onclick = () => {location.href = `/pregunta/hard`};