document.getElementById('compareBtn').addEventListener('click', async () => {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (!file1 || !file2) {
        alert('Por favor, selecione dois arquivos XML.');
        return;
    }

    const xml1 = await file1.text();
    const xml2 = await file2.text();

    const products1 = parseXML(xml1);
    const products2 = parseXML(xml2);

    const differences = compareProducts(products1, products2);
    document.getElementById('result').textContent = differences;
});

function parseXML(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');
    const products = [];

    const detNodes = xml.getElementsByTagName('det');
    for (const det of detNodes) {
        const prod = det.getElementsByTagName('prod')[0];
        if (prod) {
            products.push({
                id: prod.getElementsByTagName('cProd')[0]?.textContent || '',
                name: prod.getElementsByTagName('xProd')[0]?.textContent || '',
                ean: prod.getElementsByTagName('cEAN')[0]?.textContent || '',
                ncm: prod.getElementsByTagName('NCM')[0]?.textContent || '',
                value: prod.getElementsByTagName('vUnCom')[0]?.textContent || '',
            });
        }
    }
    return products;
}

function compareProducts(products1, products2) {
    let output = '';

    for (const prod1 of products1) {
        const match = products2.find(prod2 => prod1.id === prod2.id);
        if (match) {
            if (JSON.stringify(prod1) !== JSON.stringify(match)) {
                output += `<span class="error">Produto com ID ${prod1.id} tem diferenças:\n    XML1: ${JSON.stringify(prod1)}\n    XML2: ${JSON.stringify(match)}</span>\n`;
            } else {
                output += `<span class="success">Produto com ID ${prod1.id} é idêntico nos dois XMLs.</span>\n`;
            }
        } else {
            output += `<span class="warning">Produto com ID ${prod1.id} só está presente no XML 1.</span>\n`;
        }
    }

    for (const prod2 of products2) {
        if (!products1.find(prod1 => prod1.id === prod2.id)) {
            output += `<span class="warning">Produto com ID ${prod2.id} só está presente no XML 2.</span>\n`;
        }
    }

    return output || '<span class="success">Nenhuma diferença encontrada.</span>';
}