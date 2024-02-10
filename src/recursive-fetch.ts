interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

async function recursiveFetch(page = 1, result = new Map<number, string>()): Promise<Map<number, string>> {
    console.log(`Fetching page ${page}`)
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${page}`);
    const data = await response.json() as Comment[];
    console.log(`Fetched ${data.length} items from page ${page}`)
    if (data.length === 0) return result;

    data.forEach((item) => result.set(item.id, item.email));
    return recursiveFetch(page + 1, result);
}

async function run() {
    const resultMap = await recursiveFetch();
    const randomId = Math.floor(Math.random() * 500);
    const mapLength = resultMap.size;
    console.log(`Fetched ${mapLength} items`)
    console.log(resultMap.get(randomId));
}

run();