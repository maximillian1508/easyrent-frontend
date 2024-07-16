import { useEffect } from "react";

const useTitle = (title) => {
	const siteTitle = " | Easyrent";

	useEffect(() => {
		const prevTitle = document.title;
		document.title = `${title} ${siteTitle}`;

		return () => {
			document.title = prevTitle;
		};
	}, [title]);
};

export default useTitle;
