import json
T=json.load(open('/tmp/hp_tables.json'))
def spec_of(pn):
    d=T[str(pn)]; models=d['models']; out={m:{} for m in models}; seen=set()
    for r in d['rows']:
        g1=(r['g1'] or '').replace('\n',' '); lab=r['lab']; unit=r['unit']; g2=(r['g2'] or '').replace('\n',' ')
        def put(key):
            if key in seen: return
            for m,v in zip(models,r['vals']):
                out[m][key]=(v or '').replace('\n',' ').replace('Α','A').strip() if key.startswith('cls') else (v or '').replace('\n',' ').strip()
            seen.add(key)
        if g1.startswith('Θέρμανση') and lab=='Απόδοση': put('heat')
        if g1.startswith('Θέρμανση') and lab=='COP': put('cop')
        if g1.startswith('Ψύξη') and lab=='Απόδοση': put('cool')
        if g1.startswith('Εποχιακή') and unit in ('κλάση','class','Εν. κλάση'): put('cls35' if 'cls35' not in seen else 'cls55')
        if g1.startswith('SCOP'): put('scop35' if 'scop35' not in seen else 'scop55')
        if g1.startswith('Τάση'): put('power')
        if g1.startswith('Ηλεκτρική Αντίσταση'): put('heater')
        if g1.startswith('Συμπιεστής'): put('comp')
        if g1.startswith('Ψυκτικό'): put('ref')
        if g1.startswith('Ηχητική'): put('sound')
        if g1.startswith('Διαστάσεις (') or g1.startswith('Διαστάσεις Μονάδας'): put('dims')
        if g1.startswith('Καθαρό'): put('kg')
        if g1.startswith('Δοχείο') and g2.startswith('Χωρητ'): put('tank')
        L=lab or g2
        if g1.startswith('Εύρος Λειτουργίας Εξωτερικής'): put({'Ψύξη':'oCool','Θέρμανση':'oHeat','ΖΝΧ':'oDhw'}.get(L,'x'))
        if g1.startswith('Εύρος Λειτουργίας Εξόδου'): put({'Ψύξη':'wCool','Θέρμανση':'wHeat','ΖΝΧ (δοχείο)':'wDhw'}.get(L,'x'))
    return out
S={}
for pn in [11,13,14,16,18,20]: S.update(spec_of(pn))
json.dump(S,open('specs.json','w'),ensure_ascii=False,indent=0)
miss=[(k,f) for k,v in S.items() for f in ['heat','cop','cool','cls35','cls55','scop35','power','sound','dims','kg','oHeat','wHeat','wDhw','ref','comp'] if f not in v or not v[f]]
print(miss)
print(S['ATS04S/HU100WT190S3'])
