import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";
import path from "path";

import fs from "fs";
import { StickerDetail } from "../components/sticker_detail.js";
import { Picker } from "../components/sticker_picker.js";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }asdf

const BASE_URL = process.env.BASE_URL || "1b6b8cccc2bcb4e9a9ce028b0adc82dca";
const SIGNER_UUID =
	process.env.SIGNER_UUID || "58df769a-2332-4791-b43d-b75f4d09ed4a";
const NEYNAR_URL = process.env.NEYNAR_URL || "https://api.neynar.com/v2";
const SIMPLEHASH_URL =
	process.env.SIMPLEHASH_URL ||
	"https://api.simplehash.com/api/v0/nameservice/reverse_lookup";
const NEYNAR_API_KEY =
	process.env.NEYNAR_API_KEY || "E3FB6EAC-619F-4C8D-A042-A5EEBD56F959";
const SIMPLEHASH_API_KEY =
	process.env.SIMPLEHASH_API_KEY ||
	"2gotuguu_sk_1f1ddf52-06a6-43ab-b985-bfa3f624293d_ixt2md8e117q7a50";
const ADD_ACTION_URL =
	"https://warpcast.com/~/add-cast-action?url=${BASE_URL}/action";

const stickersDir = path.join(process.cwd(), "public", "stickers");

export interface Stickers {
	[name: string]: string;
}

export interface ColorCodes {
	[name: string]: string;
}

const stickers: Stickers = {};

const colorCodes: ColorCodes = {
	thanks: "#8d40fe",
	gm: "#0754ff",
	keep_building: "#ffbf38",
	hello: "#0754ff",
	wow: "#ffbf38",
	awesome: "#ff9831",
	super: "#fa3d21",
	love_it: "#fa3d21",
	amazing: "#54cd82",
};
// thanks.base ✅ purple
// gm.base ✅ blue
// keep building.base ✅ yellow
// hello.base ✅ blue
// wow.base (yellow)
// awesome.base (orange)
// super.base (red)
// love it.base (red)
// amazing.base (green)
// lol.base (pink)
enum StickerCategoryEnum {
	THANKS = "thanks",
	GM = "gm",
	KEEP_BUILDING = "keep_building",
	HELLO = "hello",
	WOW = "wow",
	AWESOME = "awesome",
	SUPER = "super",
	AMAZING = "amazing",
	LOVEIT = "love_it",
}

export const app = new Frog<{ State: State }>({
	assetsPath: "/",
	basePath: "/api",
	initialState: {
		status: "valid",
		stickerName: "",
	},
	// Supply a Hub to enable frame verification.
	// hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

const stickerIndex: string[] = Object.values(StickerCategoryEnum);
fs.readdirSync(stickersDir, { withFileTypes: true })
	.filter((dirent) => dirent.isFile() && dirent.name.endsWith(".png"))
	.forEach((dirent) => {
		const stickerName = dirent.name.split(".")[0];
		const filePath = path.join("/stickers", dirent.name);
		stickers[stickerName] = filePath;
	});

type State = {
	status: string;
	stickerName: StickerCategoryEnum;
};

app.frame("/", async (c) => {
	return c.res({
		image: "/images/banner.png",
		intents: [
			<Button.Link href={ADD_ACTION_URL}>Add Sticker Pack Action</Button.Link>,
		],
	});
});

app.frame(`/sticker/:sticker-name/:fid`, async (c) => {
	const pathParts = c.req.path.replace("/sticker/", "").split("/");
	const isValidName = Object.values(StickerCategoryEnum).includes(
		pathParts[0] as StickerCategoryEnum
	);
	const sticker_name = isValidName ? pathParts[0] : StickerCategoryEnum.HELLO;

	const fid = pathParts[1] || null;
	console.log(sticker_name, fid);
	const optionsUser = {
		method: "GET",
		headers: { accept: "application/json", api_key: NEYNAR_API_KEY },
	};

	let userName = "";
	let userImg = "";
	let basename = "";

	await fetch(`${NEYNAR_URL}/farcaster/user/bulk?fids=${fid}&viewer_fid=1`, {
		...optionsUser,
	})
		.then(async (val) => {
			const userData = await val.json();
			userName = userData.users[0]?.username;
			userImg = userData.users[0]?.pfp_url;
			const userAddresses = userData.users[0]?.verifications;
			const userAddress = userData.users[0]?.custody_address;
			basename = userData.users[0]?.display_name;
			const addOptions = {
				method: "GET",
				headers: {
					accept: "application/json",
					"X-API-KEY": SIMPLEHASH_API_KEY,
				},
			};
			const addresses = [userAddress, ...(userAddresses || [])];
			const resName = await fetch(
				`${SIMPLEHASH_URL}?wallet_addresses=${addresses}&protocols=base_name_service`,
				addOptions
			);
			const baseNames = await resName.json();
			// loop over basenames and get the first non null basename.name
			basename = baseNames.find((bn: any) => bn.name)?.name || basename;
		})
		.catch((e) => console.log("sticker error: ", e));

	return c.res({
		image: (
			<StickerDetail
				bgImg={stickers[sticker_name]}
				userName={userName}
				fid={fid}
				color={colorCodes[sticker_name]}
				basename={basename}
				userImg={userImg}
			/>
		),
		intents: [
			<Button.Link href={ADD_ACTION_URL}>Add Sticker Pack Action</Button.Link>,
		],
	});
});

app.frame("/sticker-picker", async (c) => {
	// const { buttonValue, inputText, deriveState, status } = c;

	console.log("/sticker-picker => ");

	return c.res({
		// grid
		image: (
			<Picker
				stickers={stickers}
				stickerIndex={stickerIndex}
				colorCodes={colorCodes}
			/>
		),
		intents: [
			<TextInput
				placeholder={
					"Pick a sticker"
					// : "Please enter a number between 1-9"
				}
			/>,
			<Button
				value="select"
				action={
					"/sticker-preview/"
					//  : "/sticker-picker"
				}
			>
				Select
			</Button>,
		],
	});
});

app.frame("/sticker-preview", async (c) => {
	console.log("/sticker-preview => ");
	const { buttonValue, frameData, inputText, deriveState } = c;
	let sticker_name: StickerCategoryEnum;

	if (inputText) {
		const index = parseInt(inputText);
		if (index >= 1 && index <= stickerIndex.length) {
			sticker_name = stickerIndex[index - 1] as StickerCategoryEnum;
		} else {
			return c.res({
				image: (
					<Picker
						stickers={stickers}
						stickerIndex={stickerIndex}
						colorCodes={colorCodes}
					/>
				),
				intents: [
					<TextInput placeholder={"Please enter a number between 1-9"} />,
					<Button value="select" action={"/sticker-preview/"}>
						Select
					</Button>,
				],
			});
		}
	}

	const state = deriveState((previousState) => {
		if (sticker_name) previousState.stickerName = sticker_name;
	});
	console.log("state.stickerName", state.stickerName);

	const { fid, castId } = frameData!;

	const optionsUser = {
		method: "GET",
		headers: { accept: "application/json", api_key: NEYNAR_API_KEY },
	};
	let userName = "";
	let userImg = "";
	let basename = "";

	let isSuccess = false;

	await fetch(`${NEYNAR_URL}/farcaster/user/bulk?fids=${fid}&viewer_fid=1`, {
		...optionsUser,
	})
		.then(async (val) => {
			const userData = await val.json();
			userName = userData.users[0]?.username;
			userImg = userData.users[0]?.pfp_url;
			const userAddresses = userData.users[0]?.verifications;
			const userAddress = userData.users[0]?.custody_address;
			basename = userData.users[0]?.display_name;
			const addOptions = {
				method: "GET",
				headers: {
					accept: "application/json",
					"X-API-KEY": SIMPLEHASH_API_KEY,
				},
			};
			const addresses = [userAddress, ...(userAddresses || [])];
			const resName = await fetch(
				`${SIMPLEHASH_URL}?wallet_addresses=${addresses}&protocols=base_name_service`,
				addOptions
			);
			const baseNames = await resName.json();
			// loop over basenames and get the first non null basename.name
			basename = baseNames.find((bn: any) => bn.name)?.name || basename;
		})
		.catch((e) => console.log("sticker error: ", e));

	if (buttonValue === "cast" && userName) {
		console.log("cast");
		const url = `${BASE_URL}/sticker/${state.stickerName}/${fid}`;
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				api_key: NEYNAR_API_KEY,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				text: `@${userName}`,
				parent: castId.hash,
				signer_uuid: SIGNER_UUID,
				embeds: [{ url: url }],
			}),
		};
		await fetch(`${NEYNAR_URL}/farcaster/cast/`, options)
			.then(async (val) => {
				const dt = await val.json();
				console.log("dt: ", dt);
				isSuccess = true;
			})
			.catch((e) => console.log("cast error: ", e));
	}
	return c.res({
		image: isSuccess ? (
			<p>Success</p>
		) : (
			<StickerDetail
				bgImg={stickers[state.stickerName]}
				userName={userName}
				fid={fid}
				color={colorCodes[state.stickerName]}
				basename={basename}
				userImg={userImg}
			/>
		),
		intents: isSuccess
			? []
			: [
					<Button value="back" action="/sticker-picker">
						Back
					</Button>,
					<Button value="cast" action={`/sticker-preview`}>
						Cast
					</Button>,
			  ],
	});
});

app.hono.get("/action", async (c) => {
	return c.json({
		name: "Stickers",
		icon: "smiley",
		description: "Reply with stickers",
		action: {
			type: "post",
		},
	});
});

app.hono.post("/action", async (c) => {
	return c.json({
		type: "frame",
		frameUrl: `${BASE_URL}/sticker-picker`,
	});
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
