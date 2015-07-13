export default function menuScroll(elementId) {
	
	const scrollableElement = document.getElementById(elementId);
	const menuElement = document.getElementsByClassName('menu')[0];
	menuElement.style.top = 0;
	
	let wasScrollingUp = false;
	let isScrollingUp = false;
	let previousScrollTop = 0;
	let inflexion = 0;
	let scrollTop = 0;
	let h, distance, top, newTopUp ;
	
	scrollableElement.onscroll = e => {
		
		// Correspond à la hauteur totale du menu
		// Le CSS et le DOM doit être chargé pour que sa valeur soit correcte
		// D'où le fait qu'il se trouve dans .onscroll et pas en const à l'extérieur de la function
		h = menuElement.offsetHeight;
		
		// La distance en pixel du menu au bord haut de l'écran (slice : '12px' --> 12)
		top = parseInt(menuElement.style.top.slice(0, -2), 10);
		
		// Le nombre de pixels invisibles car scrollés vers le haut
		scrollTop = scrollableElement.scrollTop;
		
		// La différence de pixel depuis le dernier scroll = distance scrollée
		distance = previousScrollTop - scrollTop;
		isScrollingUp = previousScrollTop - scrollTop > 0;
		
		// Si changement de direction on enregistre la position de l'inflexion
		if (wasScrollingUp !== isScrollingUp) inflexion = scrollTop;
		
		// Si le menu est partiellement affiché
		newTopUp = top > -h && top < 0 ? top + distance : inflexion - scrollTop - h;
		// Si le menu est complement affiché (top === 0)
		newTopUp = top ? newTopUp : 0;
		
		// Application de la nouvelle position, bornée par [-h, 0]
		menuElement.style.top = Math.min(Math.max(isScrollingUp ? newTopUp : top + distance, -h), 0);
		
		wasScrollingUp = isScrollingUp;
		previousScrollTop = scrollTop;
	};
	
}