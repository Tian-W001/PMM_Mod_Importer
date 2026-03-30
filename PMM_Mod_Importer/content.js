const characterNameMap = {
  "Von Lycaon": "Lycaon",
  "Wise": "Wise",
  "Belle": "Belle",
  "Alexandrina Sebastiane": "Rina",
  "Anby Demara": "Anby",
  "Anton Lvanov": "Anton",
  "Ben Bigger": "Ben",
  "Billy Kidd": "Billy",
  "Corin Wickes": "Corin",
  "Ellen Joe": "Ellen",
  "Grace Howard": "Grace",
  "Koleda Belobog": "Koleda",
  "Luciana de Montefio": "Lucy",
  "Nekomiya Mana": "Nekomata",
  "Nicole Demara": "Nicole",
  "Piper Wheel": "Piper",
  "Soldier 11": "Soldier11",
  "Soukaku": "Soukaku",
  "Zhu Yuan": "ZhuYuan",
  "Seth Lowell": "Seith",
  "Qingyi": "Qingyi",
  "Hoshimi Miyabi": "Miyabi",
  "Jane Doe": "Jane",
  "Caesar King": "Caesar",
  "Burnice White": "Burnice",
  "Yanagi Tsukishiro": "Yanagi",
  "Lighter": "Lighter",
  "Asaba Harumasa": "Harumasa",
  "Astra Yao": "Astra",
  "Evelyn Chevalier": "Evelyn",
  "Pulchra Fellini": "Pulchra",
  "Soldier 0 Anby": "Anby0",
  "Trigger": "Trigger",
  "Vivian Banshee": "Vivian",
  "Hugo Vlad": "Hugo",
  "Yixuan": "Yixuan",
  "Pan Yinhu": "PanYinhu",
  "Ju Fufu": "JuFufu",
  "Yuzuha Ukinami": "Yuzuha",
  "Alice Thymefield": "Alice",
  "Seed": "Seed",
  "Orphie Magnusson": "Orphie",
  "Komano Manato": "Manato",
  "Lucia Elowen": "Lucia",
  "Yidhari Murphy": "Yidhari",
  "Dialyn": "Dialyn",
  "Banyue": "Banyue",
  "Ye Shunguang": "YeShunguang",
  "Zhao": "Zhao",
  "Sunna": "Sunna",
  "Aria": "Aria",
  "Nangong Yu": "Nangong",
  "Cissia": "Cissia",
}

/**
 * 
 * @returns string of CharacterName or null
 */
function getCharacterName() {
    let characterName = null;

    const results = {
        subCategory: null,
        superCategory: null
    };
    const module = document.querySelector('#CategoryModule');
    if (!module) return null;
    const terms = module.querySelectorAll('dt');
    terms.forEach(dt => {
        const label = dt.textContent.trim();
        const dd = dt.nextElementSibling;

        if (dd && dd.tagName === 'DD') {
            const value = dd.querySelector('span')?.textContent.trim();
            if (label === "Sub-category") {
                results.subCategory = value;
            } else if (label === "Super-category") {
                results.superCategory = value;
            }
        }
    });
    if (results.superCategory === "Character Skins") {
      characterName = characterNameMap[results.subCategory] || "Unknown";
    }
    return characterName;
}


function getModInfo() {
  /**
   *  returns: {
        modName: string;
        modSource: string;
        characterName?: string;
        coverImageLink: string;
        downloadLinks: {
          filename: string;
          href: string;
        }[];
      }
  */

  const modSource = location.href;

  // should always be present on page
  const modName = document.querySelector('#PageTitle')?.textContent?.trim().replace(/\t/g, '');

  const characterName = getCharacterName();
  console.log("[PMM] Character Name:", characterName);

  const coverImageLink = document.querySelector('#ScreenshotsModule .PrimaryPreview')?.href || null;
  
  const downloadLinks = [];
  
  const downloadModule = document.querySelector('#FilesModule');
  if (!downloadModule) {
    console.log("[PMM] No download module found on page");
    return;
  }

  downloadModule.querySelectorAll('li.File.Flow').forEach(li => {
    const filename = li.querySelector('.FileName')?.innerText?.trim().replace(/\t/g, '') || 'Unknown File';
    const link = [...li.querySelectorAll('a.DownloadLink')].find(a => 
      a.innerText.includes('Download')
    );
    if (link) {
      downloadLinks.push({
        filename,
        href: link.href
      });
    }
  });
  return { modName, modSource, characterName, coverImageLink, downloadLinks };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_MOD_INFO') {
    const modInfo = getModInfo();
    sendResponse(modInfo);
  }
});