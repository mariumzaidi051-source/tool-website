(function(){
  try{
    var saved = localStorage.getItem('tolvexa_theme');
    // Spec requirement: TOLVEXA defaults to dark mode for first-time visitors.
    // Once the person explicitly picks a theme (via the toggle), that choice
    // is saved and always wins on future visits.
    var theme = saved ? JSON.parse(saved) : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }catch(e){
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
