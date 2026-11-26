# Prepara o DB11 (Black Snow, CC-BY-4.0) para o site: tira o cofre do motor e os emblemas, subdivide a lataria
# (o reflexo das faixas saía serrilhado na malha grossa) e exporta .glb com Draco.
# Uso: blender --background --factory-startup --python fonte/prepara_db11.py -- <scene.gltf> <saida.glb>
#      (no Mac, /Applications/Blender.app/Contents/MacOS/Blender no lugar de "blender"; Blender 4.2 ou mais novo)
import math
import re
import sys

import bpy

src, out = sys.argv[sys.argv.index('--') + 1:][:2]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

FORA = re.compile(r'engbay|intake|engine|radiator|strutbrace|subframe|bumperbar|tierod|swaybar|steeringbox')
EMBLEMAS = {'amdb11_badging', 'amdb11_badging_chrome', 'amdb11_amr', 'amdb11_symbols2', 'amdb11_stickers'}
PINTURA = {'amdb11', 'amdb11_roof'}


def materiais(ob):
    return {s.material.name for s in ob.material_slots if s.material}


malhas = [ob for ob in bpy.data.objects if ob.type == 'MESH']
fora = [ob for ob in malhas if FORA.search(ob.name) or materiais(ob) & EMBLEMAS]
for ob in fora:
    bpy.data.objects.remove(ob, do_unlink=True)
print('apagadas', len(fora))

faces_antes = faces_depois = 0
for ob in [ob for ob in bpy.data.objects if ob.type == 'MESH' and materiais(ob) & PINTURA]:
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    faces_antes += len(ob.data.polygons)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=1e-5)
    bpy.ops.mesh.tris_convert_to_quads()
    bpy.ops.object.mode_set(mode='OBJECT')
    mod = ob.modifiers.new('suave', 'SUBSURF')
    mod.levels = 1
    mod.render_levels = 1
    bpy.ops.object.modifier_apply(modifier='suave')
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
    faces_depois += len(ob.data.polygons)
print('lataria: faces', faces_antes, '->', faces_depois)

# sem UV (o site não usa textura: o acabamento é matcap) e peças que não aparecem de cima mais leves
for ob in [ob for ob in bpy.data.objects if ob.type == 'MESH' and not materiais(ob) & PINTURA]:
    if len(ob.data.polygons) < 2000:
        continue
    mod = ob.modifiers.new('leve', 'DECIMATE')
    mod.ratio = 0.5
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.ops.object.modifier_apply(modifier='leve')

bpy.ops.export_scene.gltf(
    filepath=out, export_format='GLB', export_apply=True, export_texcoords=False,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_draco_position_quantization=16, export_draco_normal_quantization=12,
)
print('ok', out)
