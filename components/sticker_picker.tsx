import { ColorCodes, Stickers } from "../api/index.js";

export const Picker = ({
	stickers,
	stickerIndex,
	colorCodes,
}: {
	stickers: Stickers;
	stickerIndex: string[];
	colorCodes: ColorCodes;
}) => {
	return (
		<div
			style={{
				display: "flex",
				height: "100%",
				width: "100%",
				backgroundColor: "white",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "10px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					height: "100%",
					width: "100%",
					textAlign: "center",
					backgroundColor: "white",
				}}
			>
				{stickerIndex.map((e, i) => (
					<div
						style={{
							display: "flex",
							height: "33.3%",
							width: "33.3%",
							padding: "10px",
						}}
					>
						<div
							style={{
								display: "flex",
								position: "relative",
								backgroundColor: colorCodes[e],
								height: "100%",
								width: "100%",
								borderRadius: "15px",
								boxShadow: "0px 5px 10px #939393",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div
								style={{
									position: "absolute",
									display: "flex",
									height: "50px",
									width: "50px",
									backgroundColor: "white",
									borderRadius: "50px",
									top: 10,
									left: 10,
									fontSize: "30px",
									fontWeight: 900,
									textAlign: "center",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{i + 1}
							</div>
							<img
								style={{
									objectFit: "contain",
									position: "absolute",
									width: "100%",
									height: "100%",
								}}
								src={stickers[e]}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
