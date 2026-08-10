import { browser } from '$app/environment';
import { sfxr } from 'jsfxr';

const soundData = {
	skillUp: "1EnKd4Bw15KrVQpcF3jNC4FUeHkFXLpH3fhbG6fooYLwobw6BqJvEL7upJsqgDiffkvj5tAN74hdBHR35RC1ZqBUqZUJMFGpsVBwW6tykNK8rxnez3LfAS5dD",
	skillDown: "7BMHBGU5tApVK66KgXzsGSwbVvEYeayn99EphRqfxBCF2YUndvbZX6gTFJeTn64Ff5QBVeA5xk3ehaZ9PHueiASzZzejB1fBopw5WEReyTpcrmCGyhz7KzFTV"
}

class Sounds {
	playSkillUp() {
		if (!browser) return;
		sfxr.toAudio(soundData.skillUp).play();
	}
	playSkillDown() {
		if (!browser) return;
		sfxr.toAudio(soundData.skillDown).play();
	}
}
export const sounds = new Sounds();