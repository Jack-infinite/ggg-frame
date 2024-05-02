export const StickerDetail = ({
	userName,
	bgImg,
	fid,
	color,
	basename,
	userImg,
}: {
	userName?: string;
	bgImg: string;
	fid?: number | string | null;
	color: string;
	basename: string;
	userImg?: string;
}) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				position: "relative",
				fontFamily: "Satoshi",
				backgroundColor: color,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<img
				style={{
					objectFit: "contain",
					position: "absolute",
					// bottom: "12%",
					width: "100%",
					height: "100%",
				}}
				src={bgImg}
			/>

			{fid && userName && (
				<div
					style={{
						display: "flex",
						position: "absolute",
						padding: "15px 20px",
						borderRadius: "25px",
						border: "3px solid #d9def0",
						right: 20,
						top: 20,
						backgroundColor: "white",
					}}
				>
					{userImg && (
						<img
							height="60px"
							width="60px"
							style={{
								borderRadius: "50%",
								marginRight: "15px",
								marginTop: "5px",
							}}
							src={userImg}
						/>
					)}

					<div
						style={{
							display: "flex",
							gap: "5px",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								fontSize: "28px",
								fontWeight: "bold",
							}}
						>
							{basename}
						</div>
						<div
							style={{
								display: "flex",
								fontSize: "22px",
							}}
						>
							@{userName}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

// <div
//   style={{
//     display: "flex",
//     flexDirection: "column",
//     width: "100%",
//     height: "100%",
//     position: "relative",
//     fontFamily: "Satoshi",
//     backgroundColor: colorCodes[sticker_name],
//     alignItems: "center",
//     justifyContent: "center",
//   }}
// >
//   <img
//     style={{
//       objectFit: "contain",
//       position: "absolute",
//       width: "65%",
//       height: "65%",
//     }}
//     src={stickers[sticker_name]}
//   />

//   {fid && userName && (
//     <div
//       style={{
//         display: "flex",
//         position: "absolute",
//         padding: "15px",
//         borderRadius: "25px",
//         border: "3px solid #d9def0",
//         right: 20,
//         top: 20,
//         backgroundColor: "white",
//       }}
//     >
//       {userImg && (
//         <img
//           height="60px"
//           width="60px"
//           style={{
//             borderRadius: "50%",
//             marginRight: "15px",
//             marginTop: "5px",
//           }}
//           src={userImg}
//         />
//       )}

//       <div
//         style={{
//           display: "flex",
//           gap: "5px",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             fontSize: "28px",
//             fontWeight: "bold",
//           }}
//         >
//           {basename}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             fontSize: "22px",
//           }}
//         >
//           @{userName}
//         </div>
//       </div>
//     </div>
//   )}
// </div>
