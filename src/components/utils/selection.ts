//stackoverflow.com/questions/6249095/how-to-set-the-caret-cursor-position-in-a-contenteditable-element-div

/** return true if node found */
function searchNode(
	container: Node,
	startNode: Node,
	predicate: (node: Node) => boolean,
	excludeSibling?: boolean
): boolean {
	if (predicate(startNode as Text)) {
		return true;
	}

	for (let i = 0, len = startNode.childNodes.length; i < len; i++) {
		if (searchNode(startNode, startNode.childNodes[i], predicate, true)) {
			return true;
		}
	}

	if (!excludeSibling) {
		let parentNode = startNode;
		while (parentNode && parentNode !== container) {
			let nextSibling = parentNode.nextSibling;
			while (nextSibling) {
				if (searchNode(container, nextSibling, predicate, true)) {
					return true;
				}
				nextSibling = nextSibling.nextSibling;
			}
			parentNode = parentNode.parentNode!;
		}
	}

	return false;
}

function createRange(container: Node, start: number, end: number): Range {
	let startNode: Node | undefined;
	searchNode(container, container, (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const dataLength = (node as Text).data.length;
			if (start <= dataLength) {
				startNode = node;
				return true;
			}
			start -= dataLength;
			end -= dataLength;
			return false;
		}
		return false;
	});

	let endNode;
	if (startNode) {
		searchNode(container, startNode, (node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				const dataLength = (node as Text).data.length;
				if (end <= dataLength) {
					endNode = node;
					return true;
				}
				end -= dataLength;
				return false;
			}
			return false;
		});
	}

	const range = document.createRange();
	if (startNode) {
		if (start < (startNode as Text).data?.length) {
			range.setStart(startNode, start);
		} else {
			range.setStartAfter(startNode);
		}
	} else {
		if (start === 0) {
			range.setStart(container, 0);
		} else {
			range.setStartAfter(container);
		}
	}

	if (endNode) {
		if (end < (endNode as Text).data?.length) {
			range.setEnd(endNode, end);
		} else {
			range.setEndAfter(endNode);
		}
	} else {
		if (end === 0) {
			range.setEnd(container, 0);
		} else {
			range.setEndAfter(container);
		}
	}

	return range;
}

export function setSelectionOffset(node: Node, start: number, end: number) {
	const range = createRange(node, start, end);
	const selection = window.getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
}

function hasChild(container: Node, node: Node | null): boolean {
	while (node) {
		if (node === container) {
			return true;
		}
		node = node.parentNode;
	}

	return false;
}

function getAbsoluteOffset(container: Node, offset: number) {
	if (container.nodeType === Node.TEXT_NODE) {
		return offset;
	}

	let absoluteOffset = 0;
	for (let i = 0, len = Math.min(container.childNodes.length, offset); i < len; i++) {
		const childNode = container.childNodes[i];
		searchNode(childNode, childNode, (node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				absoluteOffset += (node as Text).data.length;
			}
			return false;
		});
	}

	return absoluteOffset;
}

export function getSelectionOffset(container: Node): [number, number] {
	let start = 0;
	let end = 0;

	const selection = window.getSelection();
	for (let i = 0, len = selection?.rangeCount as number; i < len; i++) {
		const range = selection?.getRangeAt(i) as Range;
		if (range.intersectsNode(container)) {
			const startNode = range.startContainer;
			searchNode(container, container, (node) => {
				if (startNode === node) {
					start += getAbsoluteOffset(node, range.startOffset);
					return true;
				}

				const dataLength = node.nodeType === Node.TEXT_NODE ? (node as Text).data.length : 0;

				start += dataLength;
				end += dataLength;

				return false;
			});

			const endNode = range.endContainer;
			searchNode(container, startNode, (node) => {
				if (endNode === node) {
					end += getAbsoluteOffset(node, range.endOffset);
					return true;
				}

				const dataLength = node.nodeType === Node.TEXT_NODE ? (node as Text).data.length : 0;

				end += dataLength;

				return false;
			});

			break;
		}
	}

	return [start, end];
}

export function getInnerText(container: Node) {
	const buffer: string[] = [];
	searchNode(container, container, (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			buffer.push((node as Text).data);
		}
		return false;
	});
	return buffer.join('');
}

export function getFirstInnerText(container: Node) {
	let firstInnerText = '';
	searchNode(container, container, (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			firstInnerText = (node as Text).data;
			return true;
		}
		return false;
	});
	return firstInnerText;
}
