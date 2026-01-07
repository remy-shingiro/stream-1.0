const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO;
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents`;

// Helper: GitHub API requires Base64 encoding
const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
const fromBase64 = (str) => decodeURIComponent(escape(atob(str)));

// 1. FETCH ALL DATA
export const fetchAllData = async () => {
  try {
    // FIX 1: Add cache busting (?t=...) to force fresh data
    const timestamp = Date.now();
    const [moviesReq, seriesReq] = await Promise.all([
      fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/movies.json?t=${timestamp}`),
      fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/series.json?t=${timestamp}`)
    ]);

    const movies = moviesReq.ok ? await moviesReq.json() : [];
    const series = seriesReq.ok ? await seriesReq.json() : [];

    // FIX 2: STOP OVERWRITING TYPES!
    // Only set default if type is missing. Do not force 'movie' if it is 'collection'.
    const moviesWithType = movies.map(m => ({ ...m, type: m.type || 'movie' }));
    const seriesWithType = series.map(s => ({ ...s, type: s.type || 'series' }));

    return [...moviesWithType, ...seriesWithType];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// 2. GENERIC WRITE FUNCTION (Handles Add, Edit, Delete)
const writeToGitHub = async (filename, content, message) => {
  const url = `${BASE_URL}/${filename}`;
  
  // A. Get current SHA
  const getResponse = await fetch(url, {
    headers: { 
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  
  if (!getResponse.ok) throw new Error("Failed to connect to GitHub");
  const fileData = await getResponse.json();

  // B. Write new data
  const putResponse = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      content: toBase64(JSON.stringify(content, null, 2)),
      sha: fileData.sha 
    }),
  });

  if (!putResponse.ok) throw new Error("GitHub update failed");
  return true;
};

// 3. ADD OR UPDATE ITEM
export const saveOrUpdateContent = async (item, isEdit = false) => {
  try {
    // Determine file based on type
    const isSeries = item.type === 'series' || item.category === 'Series';
    // Note: Collections are stored in movies.json by default in your logic, which is fine.
    const filename = isSeries ? "series.json" : "movies.json";
    
    // FIX 3: Fetch fresh list before writing to avoid conflicts
    const req = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/${filename}?t=${Date.now()}`);
    let currentList = await req.json();

    if (isEdit) {
      // Find index and update
      const index = currentList.findIndex(i => i.id === item.id);
      if (index !== -1) {
        currentList[index] = item;
      }
    } else {
      // Add to top
      currentList = [item, ...currentList];
    }

    await writeToGitHub(filename, currentList, `${isEdit ? 'Update' : 'Add'} ${item.title}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 4. DELETE ITEM
export const deleteContent = async (item) => {
  try {
    const isSeries = item.type === 'series' || item.category === 'Series';
    const filename = isSeries ? "series.json" : "movies.json";

    // FIX 4: Fetch fresh list before deleting
    const req = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/${filename}?t=${Date.now()}`);
    const currentList = await req.json();

    // Filter out the item to delete
    const updatedList = currentList.filter(i => i.id !== item.id);

    await writeToGitHub(filename, updatedList, `Delete ${item.title}`);
    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
};