document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type: 'GET_MOD_INFO' }, (modInfo) => {
    if (!modInfo || modInfo.downloadLinks.length === 0) {
      document.body.innerText = 'No mod information available.';
      return;
    }

    const linksContainer = document.getElementById('links');
    modInfo.downloadLinks.forEach(info => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="checkbox" data-filename="${info.filename}" data-href="${info.href}" />
        <b>${info.filename}</b>
      `;
      linksContainer.appendChild(label);
      linksContainer.appendChild(document.createElement('br'));
    });

    const btn = document.getElementById('ImportBtn');
    btn.disabled = false;
    btn.onclick = () => {
      console.log('Import button clicked');
      const checked = [...linksContainer.querySelectorAll('input[type="checkbox"]:checked')].map(input => ({
        filename: input.getAttribute('data-filename'),
        href: input.getAttribute('data-href')
      }));
      if (checked.length === 0) {
        return alert('Please select at least one file to import.');
      }
      const payload = {
        modName: modInfo.modName,
        modSource: modInfo.modSource,
        characterName: modInfo.characterName,
        coverImageLink: modInfo.coverImageLink,
        downloadLinks: checked
      };
      console.log('Payload:', payload);

      // transform to base64
      const json = JSON.stringify(payload);
      const bytes = new TextEncoder().encode(json);
      const base64 = btoa(String.fromCharCode(...bytes));
      console.log('Base64 Data:', base64);
      const url = `peakymodmanager://import?data=${encodeURIComponent(base64)}`;
      window.open(url);
      btn.innerText = 'Importing...';
      btn.disabled = true;
    };
  });
});