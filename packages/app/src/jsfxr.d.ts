declare module 'jsfxr' {
	type SfxrPreset =
		| 'pickupCoin'
		| 'laserShoot'
		| 'explosion'
		| 'powerUp'
		| 'hitHurt'
		| 'jump'
		| 'blipSelect'
		| 'synth'
		| 'tone'
		| 'click'
		| 'random';

	type SfxrSound = Record<string, unknown>;

	interface SfxrAudio {
		play(): unknown;
	}

	interface Sfxr {
		generate(preset: SfxrPreset, options?: Record<string, unknown>): SfxrSound;
		play(sound: SfxrSound | string): unknown;
		toAudio(sound: SfxrSound | string): SfxrAudio;
		toBuffer(sound: SfxrSound | string): number[];
		toWave(sound: SfxrSound | string): { dataURI: string; getAudio(): SfxrAudio };
		b58encode(sound: SfxrSound): string;
		b58decode(encoded: string): SfxrSound;
	}

	export const sfxr: Sfxr;
	export default jsfxr;
}