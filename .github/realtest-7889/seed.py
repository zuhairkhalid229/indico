# Fork-only helper for #7889: a public lecture whose description holds the
# reporter's image markup (an <img> with width/height attributes, as the editor writes it).
import sys
from datetime import timedelta

from indico.core.db import db
from indico.modules.categories import Category
from indico.modules.events.models.events import Event, EventType
from indico.modules.users import User
from indico.util.date_time import now_utc
from indico.web.flask.app import make_app

img_url = sys.argv[1]
app = make_app()
with app.app_context():
    user = User(first_name='Ada', last_name='Lovelace', email='ada@example.test', is_admin=True)
    db.session.add(user)
    db.session.flush()
    start = now_utc(exact=False) + timedelta(days=1)
    event = Event(creator=user, category=Category.get_root(), type_=EventType.lecture,
                  title='Moon lecture', start_dt=start, end_dt=start + timedelta(hours=1),
                  timezone='Europe/Zurich', acl_entries=set())
    event.description = (
        '<p><strong>Register</strong></p>'
        f'<p><img src="{img_url}" alt="" width="2048" height="1152"></p>'
    )
    db.session.add(event)
    db.session.commit()
    print(f'EVENT_ID={event.id}')
