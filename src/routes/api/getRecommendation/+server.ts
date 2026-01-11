import { json } from '@sveltejs/kit';

// This API has been disabled - the app now focuses on Islamic prayer times
export async function POST() {
	return json({
		message: 'تم تعطيل هذه الخدمة - التطبيق الآن مخصص لمواقيت الصلاة',
		error: 'Service disabled'
	}, { status: 503 });
}
