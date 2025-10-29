#!/bin/bash

# Script para generar stubs de archivos faltantes del backend

BACKEND_DIR="/run/media/lucas/SSD/Proyectos/Cintia/red social/backend"
cd "$BACKEND_DIR"

# Crear stub routes
cat > src/routes/user.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement user routes
router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'User profile' });
});

export default router;
EOF

cat > src/routes/business.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement business routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'List businesses' });
});

export default router;
EOF

cat > src/routes/product.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement product routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'List products' });
});

export default router;
EOF

cat > src/routes/service.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement service routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'List services' });
});

export default router;
EOF

cat > src/routes/story.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement story routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'List active stories' });
});

export default router;
EOF

cat > src/routes/favorite.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement favorite routes
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List favorites' });
});

export default router;
EOF

cat > src/routes/review.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement review routes
router.get('/', (req, res) => {
  res.json({ message: 'List reviews' });
});

export default router;
EOF

cat > src/routes/city.routes.ts << 'EOF'
import { Router } from 'express';

const router = Router();

// TODO: Implement city routes
router.get('/', (req, res) => {
  res.json({ message: 'List cities' });
});

export default router;
EOF

cat > src/routes/subscription.routes.ts << 'EOF'
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement subscription routes
router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'Current subscription' });
});

export default router;
EOF

cat > src/routes/search.routes.ts << 'EOF'
import { Router } from 'express';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement search routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'Search results' });
});

export default router;
EOF

echo "✅ All route stubs created successfully!"
