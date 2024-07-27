import React, { useState, useEffect } from "react";

const usePersist = () => {
	const [persist, setPersist] = useState(true);

	useEffect(() => {
		localStorage.setItem("persist", JSON.stringify(true));
	}, []);

	return [true, () => {}];
};

export default usePersist;
