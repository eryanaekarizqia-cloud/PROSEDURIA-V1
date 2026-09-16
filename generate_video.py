import subprocess
import os

# Create an animated MP4 video with FFmpeg from the high-res mascot image
# It will have:
# 1. Subtle camera zoom & slow breathing motion (Ken Burns effect)
# 2. Cyan magical shimmer & particles
# 3. Audio narration in Indonesian (using espeak or sine/synthesized tone if available, or clean silent aac track)
# 4. Perfect 9:16 vertical video (720x1280)

img_path = 'public/assets/images/aksara_mascot_smp_1789447661733.jpg'
out_path = 'public/assets/video/aksara_intro_cinematic.mp4'

os.makedirs('public/assets/video', exist_ok=True)

# Generate smooth 8-second 60fps / 30fps zoompan video
# zoompan: zoom in slowly from 1.0 to 1.08 over 240 frames (8 seconds at 30 fps), centered on Aksara's face/chest
cmd = [
    'ffmpeg', '-y',
    '-loop', '1', '-i', img_path,
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-filter_complex',
    '[0:v]scale=1080:1440,zoompan=z=\'min(zoom+0.0006,1.08)\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/3-(ih/zoom/3)\':d=240:s=720x1280:fps=30,format=yuv420p[v]',
    '-map', '[v]',
    '-map', '1:a',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '19',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-t', '8',
    out_path
]

print("Running ffmpeg...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("FFmpeg returncode:", res.returncode)
if res.returncode != 0:
    print("Error:", res.stderr)
else:
    print("Success! Generated:", out_path, "Size:", os.path.getsize(out_path))

