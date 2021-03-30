export const getParameter = (str) => {
	const url = window.location.href.split('?')[1]
	if(!url) return null
	const parameterArr = url.split('&')
	for (let i in parameterArr) {
		const arr = parameterArr[i].split('=')
		if(str == arr[0]) return arr[1]
	}
	return null
}
