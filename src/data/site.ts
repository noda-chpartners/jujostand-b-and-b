export const shop = {
	name: "十条STAND B&B",
	kana: "立ち飲み ビーアンドビー",
	postalCode: "114-0034",
	addressLines: ["東京都北区上十条1-15-9", "平成不動産ビル 3階"],
	station: "十条駅 徒歩2分",
	hours: "17:00–23:30",
	hoursNote: "平日・土日祝とも",
	closed: "不定休",
	seats: "18席",
	privateBooking: "貸切あり",
	payment: "現金、各種クレジットカード、PayPay",
	instagram: "https://www.instagram.com/jujostand_b_and_b/",
	instagramHandle: "jujostand_b_and_b",
	mapQuery: "東京都北区上十条1-15-9 平成不動産ビル",
};

export const copy = {
	lead: "気軽に、ふらっと。",
	paragraphs: [
		"自慢の手作り創作料理と新鮮なお魚、美味しいお酒にこだわりの日本酒まで。気軽にふらっと立ち寄って、一杯から楽しめる立ち飲み屋です。",
		"おひとり様でも、仲間とわいわいでも大歓迎！美味しい料理とお酒を囲んで、自然と会話が弾む楽しいひとときをお過ごしください。",
	],
	scenes: "デートにも、宴会にも、一杯だけにも。",
	welcome: "おひとり様でも、仲間とわいわいでも大歓迎",
};

export type MenuPhoto = "nikusushi" | "sashimi" | "karamen" | "harami";

export type MenuItem = {
	name: string;
	price: string;
	photo: MenuPhoto | null;
	size: "md" | "lg";
};

export const menu: MenuItem[] = [
	{ name: "肉寿司", price: "390円", photo: "nikusushi", size: "md" },
	{ name: "お任せお刺身盛り合わせ", price: "800円", photo: "sashimi", size: "md" },
	{ name: "辛麺", price: "1,200円", photo: "karamen", size: "md" },
	{ name: "ハラミステーキ", price: "1,390円", photo: "harami", size: "lg" },
	{ name: "生牡蠣", price: "400円", photo: null, size: "md" },
];

export const nav = [
	{ href: "#dishes", label: "メニュー" },
	{ href: "#drink", label: "お酒" },
	{ href: "#room", label: "店内" },
	{ href: "#place", label: "場所" },
];

export const siteUrl = "https://jujostand-b-and-b.pages.dev";

export const title = "十条STAND B&B｜十条駅徒歩2分の立ち飲み";

export const description =
	"東京都北区上十条、十条駅徒歩2分の立ち飲み屋 十条STAND B&B。平成不動産ビル3階。手作り創作料理と新鮮なお魚、こだわりの日本酒。17:00–23:30、不定休。18席、貸切あり。";
