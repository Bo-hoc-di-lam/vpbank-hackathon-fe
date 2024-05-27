const exportToMermaidFile = (codeString: string) => {
	const blob = new Blob([codeString], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'mermaid_diagram.txt';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

const exportToTerraform = (terraform: string) => {
	const blob = new Blob([terraform], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'terraform.tf';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export {
	exportToMermaidFile,
	exportToTerraform
}
