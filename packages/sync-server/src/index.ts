import { DurableObject } from 'cloudflare:workers';

export class SyncRoom extends DurableObject<Env> {
	async fetch(request: Request): Promise<Response> {
		return new Response('skillmap sync room', { status: 200 });
	}
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		const roomId = url.searchParams.get('room');
		if (!roomId) {
			return new Response('Missing "room" query parameter', { status: 400 });
		}

		const id = env.SYNC_ROOM.idFromName(roomId);
		const room = env.SYNC_ROOM.get(id);
		return room.fetch(request);
	}
} satisfies ExportedHandler<Env>;
