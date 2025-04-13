'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export const MetabaseEmbed = () => {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		const fetchUrl = async () => {
			try {
				const res = await axios.get("/api/metabase");
				setUrl(res.data.iframeUrl);
			} catch (err) {
				console.error('Lỗi khi lấy iframeUrl:', err);
			}
		};

		fetchUrl();
	}, []);

	if (!url) {
		return <div className="p-4 text-gray-500">Đang tải dashboard...</div>;
	}

	return (
		<div className="h-screen w-full overflow-hidden">
			<iframe
				src={url}
				frameBorder={0}
				width="100%"
				height="100%"
				allowFullScreen
				title="Metabase Dashboard"
			/>
		</div>
	);
};
